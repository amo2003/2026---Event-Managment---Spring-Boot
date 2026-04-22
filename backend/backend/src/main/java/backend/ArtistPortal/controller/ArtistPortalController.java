package backend.ArtistPortal.controller;

import backend.ArtistPortal.dto.ArtistPortalFeedbackDTO;
import backend.ArtistPortal.dto.ArtistPortalLoginDTO;
import backend.ArtistPortal.dto.ArtistPortalRegisterDTO;
import backend.ArtistPortal.dto.ArtistPortalResetPasswordDTO;
import backend.ArtistPortal.service.ArtistCalendarInviteService;
import backend.ArtistPortal.service.ArtistPortalService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/artist-portal")
@CrossOrigin(origins = "http://localhost:3000")
public class ArtistPortalController {

    private final ArtistPortalService artistPortalService;
    private final ArtistCalendarInviteService artistCalendarInviteService;

    public ArtistPortalController(
            ArtistPortalService artistPortalService,
            ArtistCalendarInviteService artistCalendarInviteService
    ) {
        this.artistPortalService = artistPortalService;
        this.artistCalendarInviteService = artistCalendarInviteService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody ArtistPortalRegisterDTO dto) {
        return ResponseEntity.ok(artistPortalService.register(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody ArtistPortalLoginDTO dto) {
        return ResponseEntity.ok(artistPortalService.login(dto));
    }

    @GetMapping("/dashboard/{artistId}")
    public ResponseEntity<Map<String, Object>> getDashboard(@PathVariable Long artistId) {
        return ResponseEntity.ok(artistPortalService.getDashboard(artistId));
    }

    @PostMapping("/feedback")
    public ResponseEntity<String> submitFeedback(@RequestBody ArtistPortalFeedbackDTO dto) {
        return ResponseEntity.ok(artistPortalService.submitFeedback(dto));
    }

    @PutMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ArtistPortalResetPasswordDTO dto) {
        return ResponseEntity.ok(artistPortalService.resetPassword(dto));
    }

    @GetMapping("/calendar-file/invitation/{invitationId}")
    public ResponseEntity<?> downloadCalendarFile(@PathVariable String invitationId) {
        try {
            Long id = Long.parseLong(invitationId);
            String icsContent = artistCalendarInviteService.generateIcsForInvitation(id);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=artist-event-" + id + ".ics");
            headers.add(HttpHeaders.CONTENT_TYPE, "text/calendar; charset=UTF-8");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(icsContent.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Calendar error: " + e.getMessage());
        }
    }
}