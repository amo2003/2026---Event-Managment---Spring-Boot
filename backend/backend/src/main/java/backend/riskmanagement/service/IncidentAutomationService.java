package backend.riskmanagement.service;


import backend.riskmanagement.entity.Incident;
import backend.riskmanagement.entity.IncidentLog;
import backend.riskmanagement.entity.Officer;
import backend.riskmanagement.enums.IncidentPriority;
import backend.riskmanagement.enums.IncidentStatus;
import backend.riskmanagement.enums.IncidentType;
import backend.riskmanagement.enums.OfficerRole;
import backend.riskmanagement.repository.IncidentLogRepository;
import backend.riskmanagement.repository.OfficerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class IncidentAutomationService {

    private final OfficerRepository officerRepository;
    private final IncidentLogRepository incidentLogRepository;

    private static final int MAX_ACTIVE_INCIDENTS_PER_OFFICER = 3;

    public IncidentPriority resolvePriority(IncidentType incidentType, IncidentPriority requestedPriority) {
        if (requestedPriority != null) {
            return requestedPriority;
        }

        return switch (incidentType) {
            case FIRE, MEDICAL, FIGHT, SECURITY -> IncidentPriority.HIGH;
            case CROWD_CONTROL, TECHNICAL -> IncidentPriority.MEDIUM;
            case OTHER -> IncidentPriority.LOW;
        };
    }

    public OfficerRole resolveRequiredRole(IncidentType incidentType) {
        return switch (incidentType) {
            case MEDICAL -> OfficerRole.MEDICAL_OFFICER;
            case TECHNICAL -> OfficerRole.TECHNICAL_OFFICER;
            case FIRE -> OfficerRole.SAFETY_OFFICER;
            case FIGHT, SECURITY, CROWD_CONTROL, OTHER -> OfficerRole.SECURITY_OFFICER;
        };
    }

    public void tryAutoAssignOfficer(Incident incident) {
        OfficerRole requiredRole = resolveRequiredRole(incident.getIncidentType());

        List<Officer> candidates =
                officerRepository.findByIsAvailableTrueAndRoleOrderByActiveIncidentCountAsc(requiredRole);

        if (candidates.isEmpty()) {
            incident.setStatus(IncidentStatus.REPORTED);
            createLog(
                    incident,
                    "No available matching officer found for auto-assignment",
                    "SYSTEM"
            );
            return;
        }

        Officer selectedOfficer = candidates.get(0);

        int currentCount = selectedOfficer.getActiveIncidentCount() == null
                ? 0
                : selectedOfficer.getActiveIncidentCount();

        selectedOfficer.setActiveIncidentCount(currentCount + 1);

        if (selectedOfficer.getActiveIncidentCount() >= MAX_ACTIVE_INCIDENTS_PER_OFFICER) {
            selectedOfficer.setIsAvailable(false);
        }

        incident.setAssignedOfficer(selectedOfficer);
        incident.setStatus(IncidentStatus.ASSIGNED);
        incident.setAssignedTime(java.time.LocalDateTime.now());

        createLog(
                incident,
                "Incident auto-assigned to officer: " + selectedOfficer.getFullName(),
                "SYSTEM"
        );
    }

    public void releaseOfficerIfNeeded(Incident incident) {
        if (incident.getAssignedOfficer() == null) {
            return;
        }

        Officer officer = incident.getAssignedOfficer();
        int currentCount = officer.getActiveIncidentCount() == null
                ? 0
                : officer.getActiveIncidentCount();

        if (currentCount > 0) {
            officer.setActiveIncidentCount(currentCount - 1);
        }

        if (officer.getActiveIncidentCount() < MAX_ACTIVE_INCIDENTS_PER_OFFICER) {
            officer.setIsAvailable(true);
        }
    }

    public void validateStatusTransition(IncidentStatus currentStatus, IncidentStatus newStatus) {
        if (currentStatus == newStatus) {
            return;
        }

        boolean valid = switch (currentStatus) {
            case REPORTED -> newStatus == IncidentStatus.ASSIGNED || newStatus == IncidentStatus.IN_ACTION;
            case ASSIGNED -> newStatus == IncidentStatus.IN_ACTION || newStatus == IncidentStatus.RESOLVED;
            case IN_ACTION -> newStatus == IncidentStatus.RESOLVED;
            case RESOLVED -> newStatus == IncidentStatus.CLOSED;
            case CLOSED -> false;
        };

        if (!valid) {
            throw new RuntimeException(
                    "Invalid status transition from " + currentStatus + " to " + newStatus
            );
        }
    }

    public void createLog(Incident incident, String action, String actionBy) {
        IncidentLog log = new IncidentLog();
        log.setIncident(incident);
        log.setAction(action);
        log.setActionBy(actionBy);
        incidentLogRepository.save(log);
    }
}