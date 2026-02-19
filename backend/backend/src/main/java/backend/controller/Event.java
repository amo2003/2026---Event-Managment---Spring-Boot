package backend.controller;

import backend.model.EventModel;
import backend.Service.EventService;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/society/events")
@CrossOrigin
public class Event {

    private final EventService eventService;

    public Event(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping("/create")
    public EventModel create(@RequestBody EventModel event) {
        return eventService.createEvent(event);
    }

    @GetMapping("/my/{societyId}")
    public List<EventModel> myEvents(@PathVariable Long societyId) {
        return eventService.getSocietyEvents(societyId);
    }
}
