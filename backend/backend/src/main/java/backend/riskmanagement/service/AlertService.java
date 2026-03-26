package backend.riskmanagement.service;


import backend.riskmanagement.dto.AlertCreateRequest;
import backend.riskmanagement.dto.AlertResponse;
import backend.riskmanagement.entity.Alert;
import backend.riskmanagement.entity.Incident;
import backend.riskmanagement.enums.AlertStatus;
import backend.riskmanagement.repository.AlertRepository;
import backend.riskmanagement.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;
    private final IncidentRepository incidentRepository;

    public AlertResponse createAlert(AlertCreateRequest request) {
        Alert alert = new Alert();
        alert.setTitle(request.getTitle());
        alert.setMessage(request.getMessage());
        alert.setStatus(AlertStatus.ACTIVE);

        if (request.getIncidentId() != null) {
            Incident incident = incidentRepository.findById(request.getIncidentId())
                    .orElseThrow(() -> new RuntimeException("Incident not found"));
            alert.setIncident(incident);
        }

        Alert saved = alertRepository.save(alert);
        return mapToResponse(saved);
    }

    public List<AlertResponse> getAllAlerts() {
        return alertRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private AlertResponse mapToResponse(Alert alert) {
        AlertResponse response = new AlertResponse();
        response.setId(alert.getId());
        response.setTitle(alert.getTitle());
        response.setMessage(alert.getMessage());
        response.setStatus(alert.getStatus().name());
        response.setIncidentId(alert.getIncident() != null ? alert.getIncident().getId() : null);
        response.setCreatedAt(alert.getCreatedAt());
        return response;
    }
}