package backend.Society_Stall.controller;

import backend.Society_Stall.Service.EmailService;
import backend.Society_Stall.Service.EventService;
import backend.Society_Stall.Service.dto.EventDTO;
import backend.Society_Stall.model.DeanApproval;
import backend.Society_Stall.Service.model.EventModel;
import backend.Society_Stall.repository.DeanApprovalRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/events")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {
        RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
        RequestMethod.DELETE, RequestMethod.OPTIONS
})
public class AdminEvent {

    private final EventService eventService;
    private final EmailService emailService;
    private final DeanApprovalRepository deanApprovalRepo;

    public AdminEvent(EventService eventService,
                      EmailService emailService,
                      DeanApprovalRepository deanApprovalRepo) {
        this.eventService = eventService;
        this.emailService = emailService;
        this.deanApprovalRepo = deanApprovalRepo;
    }

    @GetMapping("/pending")
    public List<EventDTO> getPendingEvents() {
        return eventService.getPendingEvents().stream()
                .map(e -> eventService.getEventWithSociety(e.getId()))
                .collect(Collectors.toList());
    }

    @GetMapping
    public List<EventDTO> getAllEvents() {
        return eventService.getAllEvents().stream()
                .map(e -> eventService.getEventWithSociety(e.getId()))
                .collect(Collectors.toList());
    }

    // ── Notify faculty dean & create approval record ──
    @PostMapping("/{id}/notify-faculty")
    public org.springframework.http.ResponseEntity<String> notifyFaculty(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            EventDTO event = eventService.getEventWithSociety(id);
            String token = UUID.randomUUID().toString();

            // Persist approval record
            DeanApproval approval = new DeanApproval();
            approval.setToken(token);
            approval.setEventId(id);
            approval.setEventName(event.getEventName());
            approval.setSocietyName(event.getSocietyName());
            approval.setFacultyName(body.getOrDefault("facultyName", ""));
            approval.setDeanName(body.getOrDefault("deanName", "Dean"));
            approval.setDeanEmail(body.get("deanEmail"));
            approval.setResponse(DeanApproval.DeanResponse.PENDING);
            approval.setSentAt(LocalDateTime.now());
            deanApprovalRepo.save(approval);

            // Send email with approve/reject links
            emailService.sendFacultyNotificationEmail(
                    body.get("deanEmail"),
                    body.getOrDefault("deanName", "Dean"),
                    body.getOrDefault("facultyName", event.getSocietyName()),
                    event.getEventName(),
                    event.getSocietyName(),
                    event.getEventDate() != null ? event.getEventDate().toString() : "—",
                    event.getStartTime() != null ? event.getStartTime().toString() : "—",
                    event.getEndTime()   != null ? event.getEndTime().toString()   : "—",
                    event.getVenue(),
                    event.getDescription(),
                    event.getContactNumber(),
                    event.getArtists(),
                    token
            );
            return org.springframework.http.ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(500).body("Failed: " + e.getMessage());
        }
    }

    // ── Dean responds via link ──
    @PostMapping("/dean-respond/{token}")
    public org.springframework.http.ResponseEntity<String> deanRespond(
            @PathVariable String token,
            @RequestBody Map<String, String> body) {
        return deanApprovalRepo.findByToken(token).map(approval -> {
            if (approval.getResponse() != DeanApproval.DeanResponse.PENDING) {
                return org.springframework.http.ResponseEntity.ok("Already responded");
            }
            String action = body.getOrDefault("action", "APPROVED");
            approval.setResponse(DeanApproval.DeanResponse.valueOf(action));
            approval.setDeanComment(body.getOrDefault("comment", ""));
            approval.setRespondedAt(LocalDateTime.now());
            deanApprovalRepo.save(approval);
            return org.springframework.http.ResponseEntity.ok("Response recorded");
        }).orElse(org.springframework.http.ResponseEntity.status(404).body("Invalid token"));
    }

    // ── Admin: get all dean approvals ──
    @GetMapping("/dean-approvals")
    public List<DeanApproval> getDeanApprovals() {
        return deanApprovalRepo.findAllByOrderBySentAtDesc();
    }

    @PutMapping("/{id}/artists")
    public EventModel updateArtists(@PathVariable Long id,
                                    @RequestBody Map<String, String> body) {
        return eventService.updateArtists(id, body.get("artists"));
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
