package backend.Artist.ArtistController;

import backend.Artist.ArtistService.ArtistInquiryService;
import backend.Artist.ArtistDTO.ArtistInquiryActionDTO;
import backend.Artist.ArtistDTO.ArtistInquiryRequestDTO;
import backend.Artist.ArtistDTO.ArtistInquiryResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/artist-inquiries")
@CrossOrigin(origins = "http://localhost:3000")
public class ArtistInquiryController {

    private final ArtistInquiryService artistInquiryService;

    public ArtistInquiryController(ArtistInquiryService artistInquiryService) {
        this.artistInquiryService = artistInquiryService;
    }

    @PostMapping
    public ResponseEntity<ArtistInquiryResponseDTO> sendInquiry(@RequestBody ArtistInquiryRequestDTO requestDTO) {
        ArtistInquiryResponseDTO response = artistInquiryService.sendInquiry(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<ArtistInquiryResponseDTO>> getInquiriesByArtist(@PathVariable Long artistId) {
        List<ArtistInquiryResponseDTO> response = artistInquiryService.getInquiriesByArtist(artistId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<ArtistInquiryResponseDTO>> getInquiriesByEvent(@PathVariable Long eventId) {
        List<ArtistInquiryResponseDTO> response = artistInquiryService.getInquiriesByEvent(eventId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/respond")
    public ResponseEntity<ArtistInquiryResponseDTO> respondToInquiry(
            @PathVariable Long id,
            @RequestBody ArtistInquiryActionDTO actionDTO) {
        ArtistInquiryResponseDTO response = artistInquiryService.respondToInquiry(id, actionDTO);
        return ResponseEntity.ok(response);
    }
}