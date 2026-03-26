package backend.riskmanagement.controller;

import backend.riskmanagement.dto.OfficerCreateRequest;
import backend.riskmanagement.entity.Officer;
import backend.riskmanagement.service.OfficerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/officers")
@RequiredArgsConstructor
public class OfficerController {

    private final OfficerService officerService;

    @PostMapping
    public Officer createOfficer(@Valid @RequestBody OfficerCreateRequest request) {
        return officerService.createOfficer(request);
    }

    @GetMapping
    public List<Officer> getAllOfficers() {
        return officerService.getAllOfficers();
    }

    @GetMapping("/available")
    public List<Officer> getAvailableOfficers() {
        return officerService.getAvailableOfficers();
    }
}