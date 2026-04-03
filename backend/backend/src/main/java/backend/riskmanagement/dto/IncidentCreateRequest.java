package backend.riskmanagement.dto;


import backend.riskmanagement.enums.IncidentPriority;
import backend.riskmanagement.enums.IncidentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IncidentCreateRequest {

    @NotNull(message = "Incident type is required")
    private IncidentType incidentType;

    private IncidentPriority priority;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Reported by is required")
    private String reportedBy;

    @NotNull(message = "Place area is required")
    private Long placeAreaId;

    @NotBlank(message = "Exact location is required")
    private String exactLocation;
}