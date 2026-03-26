package backend.riskmanagement.service;

import backend.riskmanagement.config.FileStorageConfig;
import backend.riskmanagement.dto.AssignOfficerRequest;
import backend.riskmanagement.dto.IncidentCreateRequest;
import backend.riskmanagement.dto.IncidentFilterRequest;
import backend.riskmanagement.dto.IncidentLogResponse;
import backend.riskmanagement.dto.IncidentResponse;
import backend.riskmanagement.dto.PlaceIncidentCountResponse;
import backend.riskmanagement.dto.TrackIncidentRequest;
import backend.riskmanagement.dto.UpdateIncidentStatusRequest;
import backend.riskmanagement.entity.Alert;
import backend.riskmanagement.entity.EscalationRule;
import backend.riskmanagement.entity.Incident;
import backend.riskmanagement.entity.IncidentLog;
import backend.riskmanagement.entity.IncidentProof;
import backend.riskmanagement.entity.Officer;
import backend.riskmanagement.entity.PlaceArea;
import backend.riskmanagement.enums.IncidentPriority;
import backend.riskmanagement.enums.IncidentStatus;
import backend.riskmanagement.exception.ResourceNotFoundException;
import backend.riskmanagement.repository.AlertRepository;
import backend.riskmanagement.repository.EscalationRuleRepository;
import backend.riskmanagement.repository.IncidentLogRepository;
import backend.riskmanagement.repository.IncidentProofRepository;
import backend.riskmanagement.repository.IncidentRepository;
import backend.riskmanagement.repository.OfficerRepository;
import backend.riskmanagement.repository.PlaceAreaRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final PlaceAreaRepository placeAreaRepository;
    private final IncidentLogRepository incidentLogRepository;
    private final OfficerRepository officerRepository;
    private final EscalationRuleRepository escalationRuleRepository;
    private final AlertRepository alertRepository;
    private final IncidentProofRepository incidentProofRepository;
    private final ModelMapper modelMapper;

    public IncidentResponse createIncident(IncidentCreateRequest request, MultipartFile file) {
        PlaceArea placeArea = placeAreaRepository.findById(request.getPlaceAreaId())
                .orElseThrow(() -> new ResourceNotFoundException("Place area not found"));

        Incident incident = new Incident();
        incident.setTrackingCode(generateTrackingCode());
        incident.setIncidentType(request.getIncidentType());
        incident.setDescription(request.getDescription());
        incident.setReportedBy(request.getReportedBy());
        incident.setExactLocation(request.getExactLocation());
        incident.setPlaceArea(placeArea);
        incident.setStatus(IncidentStatus.REPORTED);
        incident.setReportedTime(LocalDateTime.now());

        IncidentPriority priority = request.getPriority() != null
                ? request.getPriority()
                : suggestPriority(request.getIncidentType().name(), request.getDescription());

        incident.setPriority(priority);

        Incident savedIncident = incidentRepository.save(incident);

        saveLog(
                savedIncident,
                "Incident reported with status REPORTED and priority " + savedIncident.getPriority(),
                savedIncident.getReportedBy()
        );

        if (file != null && !file.isEmpty()) {
            saveEvidenceFile(savedIncident, file, savedIncident.getReportedBy());
        }

        createAutomaticAlert(savedIncident);

        return mapToResponse(savedIncident);
    }

    public IncidentResponse trackIncident(TrackIncidentRequest request) {
        Incident incident = incidentRepository.findByTrackingCode(request.getTrackingCode().trim())
                .orElseThrow(() -> new ResourceNotFoundException("No incident found for this tracking code"));

        return mapToResponse(incident);
    }

    public List<IncidentResponse> getAllIncidents() {
        return incidentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public IncidentResponse getIncidentById(Long id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id: " + id));
        return mapToResponse(incident);
    }

    public IncidentResponse assignOfficer(Long incidentId, AssignOfficerRequest request) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));

        Officer officer = officerRepository.findById(request.getOfficerId())
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found"));

        incident.setAssignedOfficer(officer);
        incident.setAssignedTime(LocalDateTime.now());
        incident.setStatus(IncidentStatus.ASSIGNED);

        officer.setActiveIncidentCount(officer.getActiveIncidentCount() + 1);
        officerRepository.save(officer);

        Incident saved = incidentRepository.save(incident);

        saveLog(saved, "Officer assigned: " + officer.getFullName(), "SYSTEM");

        return mapToResponse(saved);
    }

    public IncidentResponse autoAssignOfficer(Long incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));

        List<Officer> availableOfficers = officerRepository.findByIsAvailableTrueOrderByActiveIncidentCountAsc();

        if (availableOfficers.isEmpty()) {
            throw new RuntimeException("No available officers found");
        }

        Officer selectedOfficer = availableOfficers.stream()
                .min(Comparator.comparingInt(Officer::getActiveIncidentCount))
                .orElseThrow(() -> new RuntimeException("No available officers"));

        incident.setAssignedOfficer(selectedOfficer);
        incident.setAssignedTime(LocalDateTime.now());
        incident.setStatus(IncidentStatus.ASSIGNED);

        selectedOfficer.setActiveIncidentCount(selectedOfficer.getActiveIncidentCount() + 1);
        officerRepository.save(selectedOfficer);

        Incident saved = incidentRepository.save(incident);

        saveLog(saved, "Officer auto-assigned: " + selectedOfficer.getFullName(), "SYSTEM");

        return mapToResponse(saved);
    }

    public IncidentResponse updateIncidentStatus(Long incidentId, UpdateIncidentStatusRequest request) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));

        IncidentStatus oldStatus = incident.getStatus();
        incident.setStatus(request.getStatus());

        if (request.getStatus() == IncidentStatus.IN_ACTION) {
            incident.setActionStartedTime(LocalDateTime.now());
        }

        if (request.getStatus() == IncidentStatus.RESOLVED) {
            incident.setResolvedTime(LocalDateTime.now());
            incident.setResolutionSummary(request.getResolutionSummary());
        }

        if (request.getStatus() == IncidentStatus.CLOSED && incident.getAssignedOfficer() != null) {
            Officer officer = incident.getAssignedOfficer();
            officer.setActiveIncidentCount(Math.max(0, officer.getActiveIncidentCount() - 1));
            officerRepository.save(officer);
        }

        Incident saved = incidentRepository.save(incident);

        String actionBy = request.getActionBy() != null ? request.getActionBy() : "SYSTEM";
        saveLog(saved, "Incident status changed from " + oldStatus + " to " + request.getStatus(), actionBy);

        return mapToResponse(saved);
    }

    public List<IncidentLogResponse> getIncidentLogs(Long incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));

        return incident.getLogs()
                .stream()
                .map(log -> {
                    IncidentLogResponse response = new IncidentLogResponse();
                    response.setId(log.getId());
                    response.setAction(log.getAction());
                    response.setActionBy(log.getActionBy());
                    response.setCreatedAt(log.getCreatedAt());
                    return response;
                })
                .toList();
    }

    public String checkEscalation(Long incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));

        if (incident.getReportedTime() == null) {
            return "Incident has no reported time";
        }

        EscalationRule rule = escalationRuleRepository.findByPriorityAndIsActiveTrue(incident.getPriority())
                .orElse(null);

        if (rule == null) {
            return "No active escalation rule found for priority " + incident.getPriority();
        }

        long minutesPassed = Duration.between(incident.getReportedTime(), LocalDateTime.now()).toMinutes();

        if (minutesPassed >= rule.getEscalationMinutes()
                && incident.getStatus() != IncidentStatus.RESOLVED
                && incident.getStatus() != IncidentStatus.CLOSED) {

            Alert alert = new Alert();
            alert.setTitle("Escalation Alert");
            alert.setMessage("Incident #" + incident.getId() + " exceeded escalation time. " + rule.getActionMessage());
            alert.setIncident(incident);
            alertRepository.save(alert);

            saveLog(incident, "Incident escalated after " + minutesPassed + " minutes", "SYSTEM");

            return "Incident escalated successfully";
        }

        return "Incident is still within allowed escalation time";
    }

    public String uploadEvidence(Long incidentId, MultipartFile file, String uploadedBy) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        saveEvidenceFile(incident, file, uploadedBy);
        return "Evidence uploaded successfully";
    }

    public List<String> getIncidentEvidencePaths(Long incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));

        return incident.getProofs()
                .stream()
                .map(IncidentProof::getFilePath)
                .toList();
    }

    public List<IncidentResponse> filterIncidents(IncidentFilterRequest request) {
        return incidentRepository.findAll().stream()
                .filter(i -> request.getStatus() == null || i.getStatus() == request.getStatus())
                .filter(i -> request.getPriority() == null || i.getPriority() == request.getPriority())
                .filter(i -> request.getIncidentType() == null || i.getIncidentType() == request.getIncidentType())
                .filter(i -> request.getPlaceAreaId() == null ||
                        (i.getPlaceArea() != null && i.getPlaceArea().getId().equals(request.getPlaceAreaId())))
                .filter(i -> request.getReportedBy() == null || request.getReportedBy().isBlank() ||
                        i.getReportedBy().toLowerCase().contains(request.getReportedBy().toLowerCase()))
                .map(this::mapToResponse)
                .toList();
    }

    public List<PlaceIncidentCountResponse> getIncidentCountsByPlace() {
        return incidentRepository.countIncidentsGroupByPlace();
    }

    private IncidentPriority suggestPriority(String incidentType, String description) {
        String text = (incidentType + " " + description).toLowerCase();

        if (text.contains("bleeding") || text.contains("unconscious") || text.contains("weapon") || text.contains("fire")) {
            return IncidentPriority.CRITICAL;
        }
        if (text.contains("fight") || text.contains("violent") || text.contains("medical")) {
            return IncidentPriority.HIGH;
        }
        if (text.contains("technical") || text.contains("sound") || text.contains("delay")) {
            return IncidentPriority.MEDIUM;
        }
        return IncidentPriority.LOW;
    }

    private String generateTrackingCode() {
        String code;

        do {
            code = "RISK-" + LocalDate.now().getYear() + "-"
                    + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        } while (incidentRepository.findByTrackingCode(code).isPresent());

        return code;
    }

    private void saveLog(Incident incident, String action, String actionBy) {
        IncidentLog log = new IncidentLog();
        log.setIncident(incident);
        log.setAction(action);
        log.setActionBy(actionBy);
        incidentLogRepository.save(log);
    }

    private void createAutomaticAlert(Incident incident) {
        Alert alert = new Alert();
        alert.setTitle("New Incident Reported");
        alert.setMessage("Incident #" + incident.getId() + " reported with priority " + incident.getPriority());
        alert.setIncident(incident);
        alertRepository.save(alert);
    }

    private void saveEvidenceFile(Incident incident, MultipartFile file, String uploadedBy) {
        try {
            Path uploadPath = Paths.get(FileStorageConfig.UPLOAD_DIR);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String savedFileName = UUID.randomUUID() + "_" + originalFilename;
            Path filePath = uploadPath.resolve(savedFileName);

            Files.copy(file.getInputStream(), filePath);

            IncidentProof proof = new IncidentProof();
            proof.setIncident(incident);
            proof.setFileName(originalFilename);
            proof.setFilePath(filePath.toString());
            proof.setFileType(file.getContentType());

            incidentProofRepository.save(proof);

            saveLog(
                    incident,
                    "Evidence uploaded: " + originalFilename,
                    uploadedBy != null && !uploadedBy.isBlank() ? uploadedBy : "SYSTEM"
            );
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload evidence: " + e.getMessage());
        }
    }

    private IncidentResponse mapToResponse(Incident incident) {
        IncidentResponse response = modelMapper.map(incident, IncidentResponse.class);
        response.setTrackingCode(incident.getTrackingCode());
        response.setPlaceAreaName(incident.getPlaceArea() != null ? incident.getPlaceArea().getName() : null);
        response.setAssignedOfficerName(
                incident.getAssignedOfficer() != null ? incident.getAssignedOfficer().getFullName() : null
        );
        return response;
    }
}