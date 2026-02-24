package backend.controller;

import backend.model.StallRegistration;
import backend.repository.StallRegistrationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/stalls")
@CrossOrigin("http://localhost:3000")
public class StallController {

    private final StallRegistrationRepository stallRepo;

    public StallController(StallRegistrationRepository stallRepo) {
        this.stallRepo = stallRepo;
    }

    // Register a new stall
    @PostMapping("/register")
    public ResponseEntity<StallRegistration> registerStall(@RequestBody StallRegistration stall) {
        stall.setRegisteredAt(LocalDateTime.now());
        
        // If payment method is card or bank, mark as completed
        if ("card".equals(stall.getPaymentMethod()) || "bank".equals(stall.getPaymentMethod())) {
            stall.setPaymentStatus("COMPLETED");
        } else {
            stall.setPaymentStatus("PENDING"); // Cash payment - pending until event day
        }
        
        StallRegistration saved = stallRepo.save(stall);
        return ResponseEntity.ok(saved);
    }

    // Get all stall registrations for an event
    @GetMapping("/event/{eventId}")
    public List<StallRegistration> getStallsByEvent(@PathVariable Long eventId) {
        return stallRepo.findByEventId(eventId);
    }

    // Get all stall registrations
    @GetMapping
    public List<StallRegistration> getAllStalls() {
        return stallRepo.findAll();
    }

    // Get stall registration by ID
    @GetMapping("/{id}")
    public ResponseEntity<StallRegistration> getStallById(@PathVariable Long id) {
        return stallRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update payment status (for admin)
    @PutMapping("/{id}/payment-status")
    public ResponseEntity<StallRegistration> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return stallRepo.findById(id)
                .map(stall -> {
                    stall.setPaymentStatus(status);
                    return ResponseEntity.ok(stallRepo.save(stall));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete stall registration
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStall(@PathVariable Long id) {
        if (stallRepo.existsById(id)) {
            stallRepo.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
