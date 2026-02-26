package backend.controller;

import backend.Service.StallAreaService;
import backend.model.StallModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stalls")
@CrossOrigin("http://localhost:3000")
public class StallAreaController {

    private final StallAreaService service;

    public StallAreaController(StallAreaService service) {
        this.service = service;
    }

    @GetMapping("/areas/{eventId}")
    public List<StallModel> getAreas(@PathVariable Long eventId) {
        return service.getAreasByEvent(eventId);
    }
}