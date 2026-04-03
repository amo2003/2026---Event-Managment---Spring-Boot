package backend.riskmanagement.service;


import backend.riskmanagement.dto.ResolutionReportRequest;
import backend.riskmanagement.dto.ResolutionReportResponse;
import backend.riskmanagement.entity.Incident;
import backend.riskmanagement.entity.IncidentResolutionReport;
import backend.riskmanagement.enums.IncidentStatus;
import backend.riskmanagement.repository.IncidentRepository;
import backend.riskmanagement.repository.IncidentResolutionReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class ResolutionReportService {

    private final IncidentRepository incidentRepository;
    private final IncidentResolutionReportRepository incidentResolutionReportRepository;
    private final IncidentAutomationService incidentAutomationService;

    public ResolutionReportResponse createResolutionReport(Long incidentId, ResolutionReportRequest request) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        if (incidentResolutionReportRepository.findByIncidentId(incidentId).isPresent()) {
            throw new RuntimeException("Resolution report already exists for this incident");
        }

        IncidentResolutionReport report = new IncidentResolutionReport();
        report.setIncident(incident);
        report.setSummary(request.getSummary());
        report.setActionTaken(request.getActionTaken());
        report.setPreparedBy(request.getPreparedBy());

        report = incidentResolutionReportRepository.save(report);

        if (incident.getStatus() != IncidentStatus.RESOLVED && incident.getStatus() != IncidentStatus.CLOSED) {
            incident.setStatus(IncidentStatus.RESOLVED);
            incident.setResolvedTime(LocalDateTime.now());
            incident.setResolutionSummary(request.getSummary());
            incidentAutomationService.releaseOfficerIfNeeded(incident);
            incidentRepository.save(incident);

            incidentAutomationService.createLog(
                    incident,
                    "Incident marked RESOLVED through resolution report creation",
                    request.getPreparedBy()
            );
        }

        incidentAutomationService.createLog(
                incident,
                "Resolution report created by " + request.getPreparedBy(),
                request.getPreparedBy()
        );

        return mapToResponse(report);
    }

    public ResolutionReportResponse getByIncidentId(Long incidentId) {
        IncidentResolutionReport report = incidentResolutionReportRepository.findByIncidentId(incidentId)
                .orElseThrow(() -> new RuntimeException("Resolution report not found for this incident"));

        return mapToResponse(report);
    }

    private ResolutionReportResponse mapToResponse(IncidentResolutionReport report) {
        ResolutionReportResponse response = new ResolutionReportResponse();
        response.setId(report.getId());
        response.setIncidentId(report.getIncident().getId());
        response.setSummary(report.getSummary());
        response.setActionTaken(report.getActionTaken());
        response.setPreparedBy(report.getPreparedBy());
        response.setCreatedAt(report.getCreatedAt());
        return response;
    }
}