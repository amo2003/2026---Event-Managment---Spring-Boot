package backend.riskmanagement.dto;


import backend.riskmanagement.enums.IncidentPriority;
import backend.riskmanagement.enums.IncidentStatus;
import backend.riskmanagement.enums.IncidentType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class IncidentResponse {

    private Long id;
    private String trackingCode;

    private IncidentType incidentType;
    private IncidentPriority priority;
    private IncidentStatus status;

    private String description;
    private String reportedBy;
    private String exactLocation;

    private Long placeAreaId;
    private String placeAreaName;

    private Long assignedOfficerId;
    private String assignedOfficerName;

    private LocalDateTime reportedTime;
    private LocalDateTime assignedTime;
    private LocalDateTime actionStartedTime;
    private LocalDateTime resolvedTime;

    private String resolutionSummary;
}