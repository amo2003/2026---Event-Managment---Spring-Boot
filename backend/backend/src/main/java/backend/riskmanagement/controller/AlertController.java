package backend.riskmanagement.controller;


import backend.riskmanagement.dto.AlertCreateRequest;
import backend.riskmanagement.dto.AlertResponse;
import backend.riskmanagement.service.AlertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @PostMapping
    public AlertResponse createAlert(@Valid @RequestBody AlertCreateRequest request) {
        return alertService.createAlert(request);
    }

    @GetMapping
    public List<AlertResponse> getAllAlerts() {
        return alertService.getAllAlerts();
    }
}