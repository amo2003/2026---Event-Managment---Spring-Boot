package backend.riskmanagement.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ResolutionReportResponse {

    private Long id;
    private Long incidentId;
    private String summary;
    private String actionTaken;
    private String preparedBy;
    private LocalDateTime createdAt;
}