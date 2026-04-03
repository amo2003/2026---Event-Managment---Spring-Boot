package backend.controller.ArtistController;

import backend.Service.ArtistService.ArtistVoteService;
import backend.dto.ArtistDTO.ArtistVoteRequestDTO;
import backend.dto.ArtistDTO.ArtistVoteResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<String> vote(@RequestBody ArtistVoteRequestDTO requestDTO) {
        return ResponseEntity.ok(artistVoteService.voteForArtist(requestDTO));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<List<ArtistVoteResponseDTO>> getResults(@PathVariable Long eventId) {
        return ResponseEntity.ok(artistVoteService.getVoteResults(eventId));
    }
}