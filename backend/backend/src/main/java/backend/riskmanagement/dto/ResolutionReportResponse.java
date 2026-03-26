package backend.riskmanagement.dto;



import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResolutionReportResponse {

    private Long id;
    private Long incidentId;
    private String summary;
    private String actionTaken;
    private String recommendations;
    private String preparedBy;
}