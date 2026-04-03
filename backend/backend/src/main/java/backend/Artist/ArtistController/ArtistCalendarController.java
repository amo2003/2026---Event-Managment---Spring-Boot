package backend.controller.ArtistController;

import backend.Service.ArtistService.ArtistCalendarService;
import backend.dto.ArtistDTO.ArtistCalendarEventDTO;
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
    

    @PostMapping
    public ResponseEntity<ArtistCalendarEventDTO> addEventToCalendar(
            @RequestBody ArtistCalendarEventDTO requestDTO) {
        return ResponseEntity.ok(artistCalendarService.addEventToCalendar(requestDTO));
    }

    @GetMapping("/{artistId}")
    public ResponseEntity<List<ArtistCalendarEventDTO>> getCalendarByArtist(@PathVariable Long artistId) {
        return ResponseEntity.ok(artistCalendarService.getCalendarByArtist(artistId));
    }

    @GetMapping("/conflict/{artistId}")
    public ResponseEntity<String> checkConflict(
            @PathVariable Long artistId,
            @RequestParam String eventDateTime) {
        return ResponseEntity.ok(artistCalendarService.checkConflict(artistId, eventDateTime));
    }
}