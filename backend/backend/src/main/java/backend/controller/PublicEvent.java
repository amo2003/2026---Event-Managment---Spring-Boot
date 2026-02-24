package backend.controller;

import backend.dto.EventDTO;
import backend.Service.EventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/events")
@CrossOrigin("http://localhost:3000")
public class PublicEvent {

    private final EventService eventService;

    public PublicEvent(EventService eventService) {
        this.eventService = eventService;
    }

    // Get all upcoming confirmed events (for home page - Upcoming Events)
    @GetMapping("/upcoming")
    public List<EventDTO> getUpcomingEvents() {
        return eventService.getUpcomingEvents();
    }

    // Get all past confirmed events (for home page - Past Events)
    @GetMapping("/past")
    public List<EventDTO> getPastEvents() {
        return eventService.getPastEvents();
    }

    // Get single event details with society info (for event detail page)
    @GetMapping("/{id}")
    public EventDTO getEventDetail(@PathVariable Long id) {
        return eventService.getEventWithSociety(id);
    }

    // Get confirmed events for a specific society (for society public profile)
    @GetMapping("/society/{societyId}")
    public List<EventDTO> getSocietyConfirmedEvents(@PathVariable Long societyId) {
        return eventService.getConfirmedEventsBySociety(societyId);
    }
}
