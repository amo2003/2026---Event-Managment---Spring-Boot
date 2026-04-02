package backend.riskmanagement.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnalyticsSummaryResponse {

    private long totalIncidents;

    private long reportedCount;
    private long assignedCount;
    private long inActionCount;
    private long resolvedCount;
    private long closedCount;

    private long criticalCount;
    private long highCount;
    private long mediumCount;
    private long lowCount;
}
