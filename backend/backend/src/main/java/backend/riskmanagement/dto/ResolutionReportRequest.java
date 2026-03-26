package backend.riskmanagement.dto;



import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResolutionReportRequest {

    @NotBlank(message = "Summary is required")
    private String summary;

    @NotBlank(message = "Action taken is required")
    private String actionTaken;

    private String recommendations;

    @NotBlank(message = "Prepared by is required")
    private String preparedBy;
}
