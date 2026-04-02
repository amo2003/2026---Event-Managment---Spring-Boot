package backend.riskmanagement.controller;


import backend.riskmanagement.dto.AnalyticsSummaryResponse;
import backend.riskmanagement.dto.PlaceIncidentCountResponse;
import backend.riskmanagement.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public AnalyticsSummaryResponse getSummary() {
        return analyticsService.getSummary();
    }

    @GetMapping("/place-counts")
    public List<PlaceIncidentCountResponse> getPlaceCounts() {
        return analyticsService.getIncidentCountsByPlace();
    }
}