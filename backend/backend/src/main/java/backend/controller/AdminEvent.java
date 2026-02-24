package backend.controller;

import backend.Service.EventService;
import backend.model.EventModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/events")
@CrossOrigin("http://localhost:3000")
public class AdminEvent {

    private final EventService eventService;

    public AdminEvent(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/pending")
    public List<EventModel> getPendingEvents() {
        return eventService.getPendingEvents();
    }

    @GetMapping
    public List<EventModel> getAllEvents() {
        return eventService.getAllEvents();
    }

    @PutMapping("/approve/{id}")
    public EventModel approveEvent(@PathVariable Long id) {
        return eventService.approveEvent(id);
    }

    @PutMapping("/reject/{id}")
    public EventModel rejectEvent(@PathVariable Long id,
                                  @RequestParam String message) {
        return eventService.rejectEvent(id, message);
    }
}