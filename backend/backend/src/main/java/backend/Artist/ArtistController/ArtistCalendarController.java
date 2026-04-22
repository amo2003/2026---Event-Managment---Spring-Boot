package backend.Artist.ArtistController;

import backend.Artist.ArtistDTO.ArtistCalendarEventDTO;
import backend.Artist.ArtistService.ArtistCalendarService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/artist-calendar")
@CrossOrigin(origins = "http://localhost:3000")
public class ArtistCalendarController {

    private final ArtistCalendarService artistCalendarService;

    public ArtistCalendarController(ArtistCalendarService artistCalendarService) {
        this.artistCalendarService = artistCalendarService;
    }

    @GetMapping("/test")
    public String test() {
        return "Artist calendar controller working";
    }

    @GetMapping("/published")
    public ResponseEntity<List<ArtistCalendarEventDTO>> getAllPublishedEvents() {
        return ResponseEntity.ok(artistCalendarService.getAllPublishedEvents());
    }

    @PostMapping
    public ResponseEntity<ArtistCalendarEventDTO> addEventToCalendar(
            @RequestBody ArtistCalendarEventDTO requestDTO) {
        return ResponseEntity.ok(artistCalendarService.addEventToCalendar(requestDTO));
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<ArtistCalendarEventDTO>> getCalendarByArtist(
            @PathVariable Long artistId) {
        return ResponseEntity.ok(artistCalendarService.getCalendarByArtist(artistId));
    }

    @GetMapping("/conflict/{artistId}")
    public ResponseEntity<String> checkConflict(
            @PathVariable Long artistId,
            @RequestParam String eventDateTime) {
        return ResponseEntity.ok(artistCalendarService.checkConflict(artistId, eventDateTime));
    }

    @PutMapping("/{id}/publish")
    public ResponseEntity<ArtistCalendarEventDTO> publishCalendarEvent(
            @PathVariable Long id) {
        return ResponseEntity.ok(artistCalendarService.publishCalendarEvent(id));
    }

    @PutMapping("/{id}/unpublish")
    public ResponseEntity<ArtistCalendarEventDTO> unpublishCalendarEvent(
            @PathVariable Long id) {
        return ResponseEntity.ok(artistCalendarService.unpublishCalendarEvent(id));
    }
}