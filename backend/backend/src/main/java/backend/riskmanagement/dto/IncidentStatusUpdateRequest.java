package backend.riskmanagement.dto;


import backend.riskmanagement.enums.IncidentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IncidentStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private IncidentStatus status;

    private String actionBy;

    private String resolutionSummary;
}
