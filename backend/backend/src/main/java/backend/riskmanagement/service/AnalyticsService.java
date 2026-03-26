package backend.riskmanagement.service;


import backend.riskmanagement.dto.AnalyticsSummaryResponse;
import backend.riskmanagement.enums.IncidentPriority;
import backend.riskmanagement.enums.IncidentStatus;
import backend.riskmanagement.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final IncidentRepository incidentRepository;

    public AnalyticsSummaryResponse getSummary() {
        AnalyticsSummaryResponse response = new AnalyticsSummaryResponse();

        var incidents = incidentRepository.findAll();

        response.setTotalIncidents(incidents.size());
        response.setReportedCount(incidents.stream().filter(i -> i.getStatus() == IncidentStatus.REPORTED).count());
        response.setAssignedCount(incidents.stream().filter(i -> i.getStatus() == IncidentStatus.ASSIGNED).count());
        response.setInActionCount(incidents.stream().filter(i -> i.getStatus() == IncidentStatus.IN_ACTION).count());
        response.setResolvedCount(incidents.stream().filter(i -> i.getStatus() == IncidentStatus.RESOLVED).count());
        response.setClosedCount(incidents.stream().filter(i -> i.getStatus() == IncidentStatus.CLOSED).count());

        response.setCriticalCount(incidents.stream().filter(i -> i.getPriority() == IncidentPriority.CRITICAL).count());
        response.setHighCount(incidents.stream().filter(i -> i.getPriority() == IncidentPriority.HIGH).count());
        response.setMediumCount(incidents.stream().filter(i -> i.getPriority() == IncidentPriority.MEDIUM).count());
        response.setLowCount(incidents.stream().filter(i -> i.getPriority() == IncidentPriority.LOW).count());

        return response;
    }
}