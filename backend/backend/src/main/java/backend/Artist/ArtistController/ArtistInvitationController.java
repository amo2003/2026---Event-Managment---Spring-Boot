package backend.Artist.ArtistController;

import backend.Artist.ArtistDTO.ArtistInvitationActionDTO;
import backend.Artist.ArtistDTO.ArtistInvitationRequestDTO;
import backend.Artist.ArtistDTO.ArtistInvitationResponseDTO;
import backend.Artist.ArtistService.ArtistInvitationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/artist-invitations")
@CrossOrigin(origins = "http://localhost:3000")
public class ArtistInvitationController {

    private final ArtistInvitationService artistInvitationService;

    public ArtistInvitationController(ArtistInvitationService artistInvitationService) {
        this.artistInvitationService = artistInvitationService;
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Artist invitation controller working");
    }

    @PostMapping
    public ResponseEntity<ArtistInvitationResponseDTO> sendInvitation(
            @RequestBody ArtistInvitationRequestDTO requestDTO) {
        ArtistInvitationResponseDTO response = artistInvitationService.sendInvitation(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/lead/{leadId}")
    public ResponseEntity<List<ArtistInvitationResponseDTO>> getInvitationsByLead(
            @PathVariable Long leadId) {
        return ResponseEntity.ok(artistInvitationService.getInvitationsByLead(leadId));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<ArtistInvitationResponseDTO>> getInvitationsByEvent(
            @PathVariable Long eventId) {
        return ResponseEntity.ok(artistInvitationService.getInvitationsByEvent(eventId));
    }

    @PutMapping("/{id}/respond")
    public ResponseEntity<ArtistInvitationResponseDTO> respondToInvitation(
            @PathVariable Long id,
            @RequestBody ArtistInvitationActionDTO actionDTO) {
        return ResponseEntity.ok(artistInvitationService.respondToInvitation(id, actionDTO));
    }

    @PutMapping("/{id}/finalize")
    public ResponseEntity<ArtistInvitationResponseDTO> finalizeInvitation(
            @PathVariable Long id) {
        return ResponseEntity.ok(artistInvitationService.finalizeInvitation(id));
    }

    @PutMapping("/{id}/reconsider")
    public ResponseEntity<ArtistInvitationResponseDTO> reconsiderInvitation(
            @PathVariable Long id) {
        return ResponseEntity.ok(artistInvitationService.reconsiderInvitation(id));
    }

    @PutMapping("/{id}/remove")
    public ResponseEntity<ArtistInvitationResponseDTO> removeInvitation(
            @PathVariable Long id) {
        return ResponseEntity.ok(artistInvitationService.removeInvitation(id));
    }
}