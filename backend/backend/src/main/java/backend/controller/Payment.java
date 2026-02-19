package backend.controller;

import backend.Service.EventService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin
public class Payment {

    private final EventService eventService;

    public Payment(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping("/{eventId}")
    public String pay(@PathVariable Long eventId,
                      @RequestParam Double amount,
                      @RequestParam String method) {

        eventService.completePayment(eventId, amount, method);
        return "Payment Successful";
    }
}
