package backend.riskmanagement.dto;



import backend.riskmanagement.enums.IncidentPriority;
import backend.riskmanagement.enums.IncidentStatus;
import backend.riskmanagement.enums.IncidentType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IncidentFilterRequest {

    private IncidentStatus status;
    private IncidentPriority priority;
    private IncidentType incidentType;
    private Long placeAreaId;
    private String reportedBy;
}