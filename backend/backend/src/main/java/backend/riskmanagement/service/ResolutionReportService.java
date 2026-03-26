package backend.riskmanagement.service;

import backend.riskmanagement.dto.ResolutionReportRequest;
import backend.riskmanagement.dto.ResolutionReportResponse;
import backend.riskmanagement.entity.Incident;
import backend.riskmanagement.entity.IncidentResolutionReport;
import backend.riskmanagement.enums.IncidentStatus;
import backend.riskmanagement.exception.ResourceNotFoundException;
import backend.riskmanagement.repository.IncidentLogRepository;
import backend.riskmanagement.repository.IncidentRepository;
import backend.riskmanagement.repository.IncidentResolutionReportRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResolutionReportService {

    private final IncidentRepository incidentRepository;
    private final IncidentResolutionReportRepository resolutionReportRepository;
    private final IncidentLogRepository incidentLogRepository;
    private final ModelMapper modelMapper;

    public ResolutionReportResponse createResolutionReport(Long incidentId, ResolutionReportRequest request) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id: " + incidentId));

        if (incident.getStatus() != IncidentStatus.RESOLVED && incident.getStatus() != IncidentStatus.CLOSED) {
            throw new RuntimeException("Resolution report can only be created for RESOLVED or CLOSED incidents");
        }

        resolutionReportRepository.findByIncidentId(incidentId).ifPresent(report -> {
            throw new RuntimeException("Resolution report already exists for this incident");
        });

        IncidentResolutionReport report = new IncidentResolutionReport();
        report.setIncident(incident);
        report.setSummary(request.getSummary());
        report.setActionTaken(request.getActionTaken());
        report.setRecommendations(request.getRecommendations());
        report.setPreparedBy(request.getPreparedBy());

        IncidentResolutionReport saved = resolutionReportRepository.save(report);

        var log = new backend.riskmanagement.entity.IncidentLog();
        log.setIncident(incident);
        log.setAction("Resolution report created");
        log.setActionBy(request.getPreparedBy());
        incidentLogRepository.save(log);

        ResolutionReportResponse response = modelMapper.map(saved, ResolutionReportResponse.class);
        response.setIncidentId(incident.getId());
        return response;
    }

    public ResolutionReportResponse getByIncidentId(Long incidentId) {
        IncidentResolutionReport report = resolutionReportRepository.findByIncidentId(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Resolution report not found for incident id: " + incidentId));

        ResolutionReportResponse response = modelMapper.map(report, ResolutionReportResponse.class);
        response.setIncidentId(report.getIncident().getId());
        return response;
    }
}