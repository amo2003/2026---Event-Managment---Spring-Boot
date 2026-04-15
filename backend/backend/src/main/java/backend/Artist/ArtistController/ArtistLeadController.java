package backend.Artist.ArtistController;

import backend.Artist.ArtistService.ArtistLeadService;
import backend.Artist.ArtistDTO.ArtistLeadRequestDTO;
import backend.Artist.ArtistDTO.ArtistLeadResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/artist-leads")
@CrossOrigin(origins = "http://localhost:3000")
public class ArtistLeadController {

    private final ArtistLeadService artistLeadService;

    public ArtistLeadController(ArtistLeadService artistLeadService) {
        this.artistLeadService = artistLeadService;
    }

    @GetMapping("/test")
    public String test() {
        return "Artist lead controller working";
    }

    @PostMapping
    public ResponseEntity<ArtistLeadResponseDTO> createLead(@RequestBody ArtistLeadRequestDTO requestDTO) {
        ArtistLeadResponseDTO response = artistLeadService.createLead(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ArtistLeadResponseDTO>> getAllLeads() {
        return ResponseEntity.ok(artistLeadService.getAllLeads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtistLeadResponseDTO> getLeadById(@PathVariable Long id) {
        return ResponseEntity.ok(artistLeadService.getLeadById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArtistLeadResponseDTO> updateLead(@PathVariable Long id,
                                                            @RequestBody ArtistLeadRequestDTO requestDTO) {
        return ResponseEntity.ok(artistLeadService.updateLead(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLead(@PathVariable Long id) {
        return ResponseEntity.ok(artistLeadService.deleteLead(id));
    }
}