package backend.riskmanagement.dto;



import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class IncidentLogResponse {
    private Long id;
    private String action;
    private String actionBy;
    private LocalDateTime createdAt;
}