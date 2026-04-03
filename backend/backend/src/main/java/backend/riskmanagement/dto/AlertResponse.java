package backend.riskmanagement.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AlertResponse {

    private Long id;
    private String title;
    private String message;
    private String status;
    private Long incidentId;
    private LocalDateTime createdAt;
}