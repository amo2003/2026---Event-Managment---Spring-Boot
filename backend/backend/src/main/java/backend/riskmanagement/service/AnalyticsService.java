package backend.riskmanagement.service;


import backend.riskmanagement.dto.AnalyticsSummaryResponse;
import backend.riskmanagement.dto.PlaceIncidentCountResponse;
import backend.riskmanagement.entity.Incident;
import backend.riskmanagement.enums.IncidentPriority;
import backend.riskmanagement.enums.IncidentStatus;
import backend.riskmanagement.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final IncidentRepository incidentRepository;

    public AnalyticsSummaryResponse getSummary() {
        AnalyticsSummaryResponse response = new AnalyticsSummaryResponse();

        response.setTotalIncidents(incidentRepository.count());

        response.setReportedCount(incidentRepository.countByStatus(IncidentStatus.REPORTED));
        response.setAssignedCount(incidentRepository.countByStatus(IncidentStatus.ASSIGNED));
        response.setInActionCount(incidentRepository.countByStatus(IncidentStatus.IN_ACTION));
        response.setResolvedCount(incidentRepository.countByStatus(IncidentStatus.RESOLVED));
        response.setClosedCount(incidentRepository.countByStatus(IncidentStatus.CLOSED));

        response.setCriticalCount(incidentRepository.countByPriority(IncidentPriority.CRITICAL));
        response.setHighCount(incidentRepository.countByPriority(IncidentPriority.HIGH));
        response.setMediumCount(incidentRepository.countByPriority(IncidentPriority.MEDIUM));
        response.setLowCount(incidentRepository.countByPriority(IncidentPriority.LOW));

        return response;
    }

    public List<PlaceIncidentCountResponse> getIncidentCountsByPlace() {
        List<Incident> incidents = incidentRepository.findAll();

        Map<Long, List<Incident>> grouped = incidents.stream()
                .filter(i -> i.getPlaceArea() != null)
                .collect(Collectors.groupingBy(i -> i.getPlaceArea().getId()));

        List<PlaceIncidentCountResponse> results = new ArrayList<>();

        for (Map.Entry<Long, List<Incident>> entry : grouped.entrySet()) {
            List<Incident> placeIncidents = entry.getValue();

            PlaceIncidentCountResponse response = new PlaceIncidentCountResponse();
            response.setPlaceAreaId(placeIncidents.get(0).getPlaceArea().getId());
            response.setPlaceAreaName(placeIncidents.get(0).getPlaceArea().getName());
            response.setIncidentCount((long) placeIncidents.size());

            results.add(response);
        }

        return results;
    }
}