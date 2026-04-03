package backend.riskmanagement.service;


import backend.riskmanagement.dto.*;
import backend.riskmanagement.entity.Incident;
import backend.riskmanagement.entity.IncidentLog;
import backend.riskmanagement.entity.IncidentProof;
import backend.riskmanagement.entity.PlaceArea;
import backend.riskmanagement.enums.IncidentStatus;
import backend.riskmanagement.repository.IncidentLogRepository;
import backend.riskmanagement.repository.IncidentProofRepository;
import backend.riskmanagement.repository.IncidentRepository;
import backend.riskmanagement.repository.PlaceAreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final PlaceAreaRepository placeAreaRepository;
    private final IncidentLogRepository incidentLogRepository;
    private final IncidentProofRepository incidentProofRepository;
    private final IncidentAutomationService incidentAutomationService;

    public IncidentResponse createIncident(IncidentCreateRequest request) {
        PlaceArea placeArea = placeAreaRepository.findById(request.getPlaceAreaId())
                .orElseThrow(() -> new RuntimeException("Place area not found"));

        Incident incident = new Incident();
        incident.setIncidentType(request.getIncidentType());
        incident.setPriority(
                incidentAutomationService.resolvePriority(
                        request.getIncidentType(),
                        request.getPriority()
                )
        );
        incident.setDescription(request.getDescription());
        incident.setReportedBy(request.getReportedBy());
        incident.setExactLocation(request.getExactLocation());
        incident.setPlaceArea(placeArea);
        incident.setReportedTime(LocalDateTime.now());
        incident.setStatus(IncidentStatus.REPORTED);
        incident.setTrackingCode(generateTrackingCode());

        incident = incidentRepository.save(incident);

        incidentAutomationService.createLog(
                incident,
                "Incident reported by " + request.getReportedBy(),
                request.getReportedBy()
        );

        incidentAutomationService.tryAutoAssignOfficer(incident);

        incident = incidentRepository.save(incident);

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
                .orElseThrow(() -> new RuntimeException("Incident not found"));
        return mapToResponse(incident);
    }

    public IncidentResponse trackIncident(TrackIncidentRequest request) {
        Incident incident = incidentRepository.findByTrackingCode(request.getTrackingCode())
                .orElseThrow(() -> new RuntimeException("Incident not found for given tracking code"));

        return mapToResponse(incident);
    }

    public List<IncidentResponse> filterIncidents(IncidentFilterRequest request) {
        String reporterName = request.getReportedBy();
        if (reporterName != null && reporterName.isBlank()) {
            reporterName = null;
        }

        return incidentRepository.filterIncidents(
                        request.getStatus(),
                        request.getPriority(),
                        request.getIncidentType(),
                        request.getPlaceAreaId(),
                        reporterName
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public IncidentResponse updateIncidentStatus(Long id, IncidentStatusUpdateRequest request) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        incidentAutomationService.validateStatusTransition(incident.getStatus(), request.getStatus());

        String actionBy = (request.getActionBy() == null || request.getActionBy().isBlank())
                ? "OFFICER"
                : request.getActionBy();

        if (request.getStatus() == IncidentStatus.IN_ACTION) {
            incident.setActionStartedTime(LocalDateTime.now());
        }

        if (request.getStatus() == IncidentStatus.RESOLVED) {
            if (request.getResolutionSummary() == null || request.getResolutionSummary().isBlank()) {
                throw new RuntimeException("Resolution summary is required when resolving incident");
            }
            incident.setResolvedTime(LocalDateTime.now());
            incident.setResolutionSummary(request.getResolutionSummary());
            incidentAutomationService.releaseOfficerIfNeeded(incident);
        }

        if (request.getStatus() == IncidentStatus.CLOSED) {
            incidentAutomationService.releaseOfficerIfNeeded(incident);
        }

        IncidentStatus oldStatus = incident.getStatus();
        incident.setStatus(request.getStatus());

        incident = incidentRepository.save(incident);

        incidentAutomationService.createLog(
                incident,
                "Status changed from " + oldStatus + " to " + request.getStatus(),
                actionBy
        );

        return mapToResponse(incident);
    }

    public List<IncidentLogResponse> getIncidentTimeline(Long incidentId) {
        List<IncidentLog> logs = incidentLogRepository.findByIncidentIdOrderByCreatedAtAsc(incidentId);

        return logs.stream().map(log -> {
            IncidentLogResponse response = new IncidentLogResponse();
            response.setId(log.getId());
            response.setAction(log.getAction());
            response.setActionBy(log.getActionBy());
            response.setCreatedAt(log.getCreatedAt());
            return response;
        }).toList();
    }

    public String uploadEvidence(Long incidentId, MultipartFile file, String uploadedBy) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Evidence file is required");
        }

        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        try {
            Path uploadDir = Paths.get("uploads", "incidents");
            Files.createDirectories(uploadDir);

            String originalFileName = file.getOriginalFilename() == null
                    ? "evidence-file"
                    : file.getOriginalFilename();

            String savedFileName = System.currentTimeMillis() + "_" +
                    UUID.randomUUID().toString().substring(0, 8) + "_" +
                    originalFileName.replace(" ", "_");

            Path targetPath = uploadDir.resolve(savedFileName);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            IncidentProof proof = new IncidentProof();
            proof.setIncident(incident);
            proof.setFileName(originalFileName);
            proof.setFileType(file.getContentType());
            proof.setFilePath(targetPath.toString());

            incidentProofRepository.save(proof);

            incidentAutomationService.createLog(
                    incident,
                    "Evidence uploaded: " + originalFileName,
                    uploadedBy == null || uploadedBy.isBlank() ? "SYSTEM" : uploadedBy
            );

            return "Evidence uploaded successfully";
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload evidence file");
        }
    }

    private String generateTrackingCode() {
        String randomPart = UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
        int year = LocalDateTime.now().getYear();
        return "RISK-" + year + "-" + randomPart;
    }

    private IncidentResponse mapToResponse(Incident incident) {
        IncidentResponse response = new IncidentResponse();
        response.setId(incident.getId());
        response.setTrackingCode(incident.getTrackingCode());
        response.setIncidentType(incident.getIncidentType());
        response.setPriority(incident.getPriority());
        response.setStatus(incident.getStatus());
        response.setDescription(incident.getDescription());
        response.setReportedBy(incident.getReportedBy());
        response.setExactLocation(incident.getExactLocation());
        response.setReportedTime(incident.getReportedTime());
        response.setAssignedTime(incident.getAssignedTime());
        response.setActionStartedTime(incident.getActionStartedTime());
        response.setResolvedTime(incident.getResolvedTime());
        response.setResolutionSummary(incident.getResolutionSummary());

        if (incident.getPlaceArea() != null) {
            response.setPlaceAreaId(incident.getPlaceArea().getId());
            response.setPlaceAreaName(incident.getPlaceArea().getName());
        }

        if (incident.getAssignedOfficer() != null) {
            response.setAssignedOfficerId(incident.getAssignedOfficer().getId());
            response.setAssignedOfficerName(incident.getAssignedOfficer().getFullName());
        }

        return response;
    }
}