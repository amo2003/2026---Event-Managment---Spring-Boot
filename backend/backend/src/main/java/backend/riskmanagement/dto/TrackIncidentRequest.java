package backend.riskmanagement.dto;



import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrackIncidentRequest {

    @NotBlank(message = "Tracking code is required")
    private String trackingCode;
}