package backend.controller.ArtistController;

import backend.Service.ArtistService.ArtistService;
import backend.dto.ArtistDTO.ArtistRequestDTO;
import backend.dto.ArtistDTO.ArtistResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/artists")
@CrossOrigin(origins = "http://localhost:3000")
public class ArtistController {

    private final ArtistService artistService;

    public ArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    @PostMapping
    public ResponseEntity<ArtistResponseDTO> createArtist(@RequestBody ArtistRequestDTO requestDTO) {
        ArtistResponseDTO response = artistService.createArtist(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ArtistResponseDTO>> getAllArtists() {
        return ResponseEntity.ok(artistService.getAllArtists());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtistResponseDTO> getArtistById(@PathVariable Long id) {
        return ResponseEntity.ok(artistService.getArtistById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArtistResponseDTO> updateArtist(@PathVariable Long id,
                                                          @RequestBody ArtistRequestDTO requestDTO) {
        return ResponseEntity.ok(artistService.updateArtist(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteArtist(@PathVariable Long id) {
        return ResponseEntity.ok(artistService.deleteArtist(id));
    }
}