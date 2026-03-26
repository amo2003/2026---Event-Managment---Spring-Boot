package backend.riskmanagement.controller;


import backend.riskmanagement.dto.AnalyticsSummaryResponse;
import backend.riskmanagement.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public AnalyticsSummaryResponse getSummary() {
        return analyticsService.getSummary();
    }
}