package backend.controller;

import backend.model.EventModel;
import backend.Service.EventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/events")
@CrossOrigin("http://localhost:3000") // allow React frontend
public class AdminEvent {

    private final EventService eventService;

    public AdminEvent(EventService eventService) {
        this.eventService = eventService;
    }

    // Get all pending events
    @GetMapping("/pending")
    public List<EventModel> getPendingEvents() {
        return eventService.getPendingEvents();
    }

    // Approve event
    @PutMapping("/approve/{id}")
    public EventModel approveEvent(@PathVariable Long id) {
        return eventService.approveEvent(id); // sets status to APPROVED_PAYMENT_PENDING
    }

    // Reject event
    @PutMapping("/reject/{id}")
    public EventModel rejectEvent(@PathVariable Long id, @RequestParam String message) {
        return eventService.rejectEvent(id, message);
    }

    // Confirm payment
    @PutMapping("/pay/{id}")
    public EventModel payEvent(@PathVariable Long id) {
        return eventService.completePayment(id, 5000.0, "CASH"); // or get amount from body
    }
}
