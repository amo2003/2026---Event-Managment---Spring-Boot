package backend.Artist.ArtistController;

import backend.Artist.ArtistDTO.ArtistVoteRequestDTO;
import backend.Artist.ArtistDTO.ArtistVoteResponseDTO;
import backend.Artist.ArtistService.ArtistVoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/artist-votes")
@CrossOrigin(origins = "http://localhost:3000")
public class ArtistVoteController {

    private final ArtistVoteService artistVoteService;

    public ArtistVoteController(ArtistVoteService artistVoteService) {
        this.artistVoteService = artistVoteService;
    }

    @GetMapping("/test")
    public String test() {
        return "Vote controller working";
    }

    @PostMapping
    public ResponseEntity<?> vote(@RequestBody ArtistVoteRequestDTO requestDTO) {
        try {
            String message = artistVoteService.voteForArtist(requestDTO);
            return ResponseEntity.ok(message);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", ex.getMessage()));
        } catch (IllegalStateException ex) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to submit vote."));
        }
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<List<ArtistVoteResponseDTO>> getResults(@PathVariable Long eventId) {
        return ResponseEntity.ok(artistVoteService.getVoteResults(eventId));
    }
}