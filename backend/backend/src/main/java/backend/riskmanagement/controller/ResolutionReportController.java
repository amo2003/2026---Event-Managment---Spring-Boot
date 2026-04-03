package backend.riskmanagement.controller;



import backend.riskmanagement.dto.ResolutionReportRequest;
import backend.riskmanagement.dto.ResolutionReportResponse;
import backend.riskmanagement.service.ResolutionReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resolution-reports")
@RequiredArgsConstructor
public class ResolutionReportController {

    private final ResolutionReportService resolutionReportService;

    @PostMapping("/incident/{incidentId}")
    public ResolutionReportResponse createResolutionReport(@PathVariable Long incidentId,
                                                           @Valid @RequestBody ResolutionReportRequest request) {
        return resolutionReportService.createResolutionReport(incidentId, request);
    }

    @GetMapping("/incident/{incidentId}")
    public ResolutionReportResponse getByIncidentId(@PathVariable Long incidentId) {
        return resolutionReportService.getByIncidentId(incidentId);
    }
}