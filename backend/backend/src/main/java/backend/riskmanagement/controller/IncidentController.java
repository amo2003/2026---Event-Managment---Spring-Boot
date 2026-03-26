package backend.riskmanagement.controller;


import backend.riskmanagement.dto.AssignOfficerRequest;
import backend.riskmanagement.dto.IncidentCreateRequest;
import backend.riskmanagement.dto.IncidentFilterRequest;
import backend.riskmanagement.dto.IncidentLogResponse;
import backend.riskmanagement.dto.IncidentResponse;
import backend.riskmanagement.dto.PlaceIncidentCountResponse;
import backend.riskmanagement.dto.TrackIncidentRequest;
import backend.riskmanagement.dto.UpdateIncidentStatusRequest;
import backend.riskmanagement.service.IncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    @PostMapping
    public IncidentResponse createIncident(@Valid @ModelAttribute IncidentCreateRequest request,
                                           @RequestParam(value = "file", required = false) MultipartFile file) {
        return incidentService.createIncident(request, file);
    }

    @PostMapping("/track")
    public IncidentResponse trackIncident(@Valid @RequestBody TrackIncidentRequest request) {
        return incidentService.trackIncident(request);
    }

    @GetMapping
    public List<IncidentResponse> getAllIncidents() {
        return incidentService.getAllIncidents();
    }

    @GetMapping("/{id}")
    public IncidentResponse getIncidentById(@PathVariable Long id) {
        return incidentService.getIncidentById(id);
    }

    @PutMapping("/{id}/assign")
    public IncidentResponse assignOfficer(@PathVariable Long id,
                                          @Valid @RequestBody AssignOfficerRequest request) {
        return incidentService.assignOfficer(id, request);
    }

    @PutMapping("/{id}/auto-assign")
    public IncidentResponse autoAssignOfficer(@PathVariable Long id) {
        return incidentService.autoAssignOfficer(id);
    }

    @PutMapping("/{id}/status")
    public IncidentResponse updateIncidentStatus(@PathVariable Long id,
                                                 @Valid @RequestBody UpdateIncidentStatusRequest request) {
        return incidentService.updateIncidentStatus(id, request);
    }

    @GetMapping("/{id}/logs")
    public List<IncidentLogResponse> getIncidentLogs(@PathVariable Long id) {
        return incidentService.getIncidentLogs(id);
    }

    @PostMapping("/{id}/check-escalation")
    public String checkEscalation(@PathVariable Long id) {
        return incidentService.checkEscalation(id);
    }

    @PostMapping("/{id}/evidence")
    public String uploadEvidence(@PathVariable Long id,
                                 @RequestParam("file") MultipartFile file,
                                 @RequestParam(value = "uploadedBy", required = false) String uploadedBy) {
        return incidentService.uploadEvidence(id, file, uploadedBy);
    }

    @GetMapping("/{id}/evidence")
    public List<String> getEvidence(@PathVariable Long id) {
        return incidentService.getIncidentEvidencePaths(id);
    }

    @PostMapping("/filter")
    public List<IncidentResponse> filterIncidents(@RequestBody IncidentFilterRequest request) {
        return incidentService.filterIncidents(request);
    }

    @GetMapping("/dashboard/by-place")
    public List<PlaceIncidentCountResponse> getIncidentCountsByPlace() {
        return incidentService.getIncidentCountsByPlace();
    }
}
