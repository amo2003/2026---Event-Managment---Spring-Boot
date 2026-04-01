package backend.Society_Stall.Service.controller;

import backend.Society_Stall.Service.EventService;
import backend.Society_Stall.Service.dto.EventDTO;
import backend.Society_Stall.Service.model.EventModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/events")
@CrossOrigin("http://localhost:3000")
public class AdminEvent {

    private final EventService eventService;

    public AdminEvent(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/pending")
    public List<EventDTO> getPendingEvents() {
        return eventService.getPendingEvents().stream()
                .map(e -> eventService.getEventWithSociety(e.getId()))
                .collect(Collectors.toList());
    }

    // Returns all events with society name included
    @GetMapping
    public List<EventDTO> getAllEvents() {
        return eventService.getAllEvents().stream()
                .map(e -> eventService.getEventWithSociety(e.getId()))
                .collect(Collectors.toList());
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
