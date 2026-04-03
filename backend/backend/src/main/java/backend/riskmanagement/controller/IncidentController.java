package backend.riskmanagement.controller;


import backend.riskmanagement.dto.*;
import backend.riskmanagement.service.IncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    @PostMapping
    public IncidentResponse createIncident(@Valid @RequestBody IncidentCreateRequest request) {
        return incidentService.createIncident(request);
    }

    @GetMapping
    public List<IncidentResponse> getAllIncidents() {
        return incidentService.getAllIncidents();
    }

    @GetMapping("/{id}")
    public IncidentResponse getIncidentById(@PathVariable Long id) {
        return incidentService.getIncidentById(id);
    }

    @PostMapping("/track")
    public IncidentResponse trackIncident(@Valid @RequestBody TrackIncidentRequest request) {
        return incidentService.trackIncident(request);
    }

    @PostMapping("/filter")
    public List<IncidentResponse> filterIncidents(@RequestBody IncidentFilterRequest request) {
        return incidentService.filterIncidents(request);
    }

    @PutMapping("/{id}/status")
    public IncidentResponse updateIncidentStatus(@PathVariable Long id,
                                                 @Valid @RequestBody IncidentStatusUpdateRequest request) {
        return incidentService.updateIncidentStatus(id, request);
    }

    @GetMapping("/{id}/timeline")
    public List<IncidentLogResponse> getIncidentTimeline(@PathVariable Long id) {
        return incidentService.getIncidentTimeline(id);
    }

    @PostMapping(value = "/{id}/evidence", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String uploadEvidence(@PathVariable Long id,
                                 @RequestParam("file") MultipartFile file,
                                 @RequestParam(value = "uploadedBy", required = false) String uploadedBy) {
        return incidentService.uploadEvidence(id, file, uploadedBy);
    }
}