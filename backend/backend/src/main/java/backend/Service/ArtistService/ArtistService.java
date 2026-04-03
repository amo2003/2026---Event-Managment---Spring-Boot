package backend.Service.ArtistService;

import backend.dto.ArtistDTO.ArtistRequestDTO;
import backend.dto.ArtistDTO.ArtistResponseDTO;
import backend.model.ArtistModel.Artist;
import backend.repository.ArtistRepository.ArtistRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArtistService {

    private final ArtistRepository artistRepository;

    public ArtistService(ArtistRepository artistRepository) {
        this.artistRepository = artistRepository;
    }

    public ArtistResponseDTO createArtist(ArtistRequestDTO requestDTO) {
        if (artistRepository.findByEmail(requestDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Artist with this email already exists");
        }

        Artist artist = new Artist();
        artist.setArtistName(requestDTO.getArtistName());
        artist.setCategory(requestDTO.getCategory());
        artist.setEmail(requestDTO.getEmail());
        artist.setPhoneNumber(requestDTO.getPhoneNumber());
        artist.setBio(requestDTO.getBio());
        artist.setPortfolioLink(requestDTO.getPortfolioLink());
        artist.setSocialLink(requestDTO.getSocialLink());
        artist.setPerformancePreferences(requestDTO.getPerformancePreferences());
        artist.setActive(true);

        Artist savedArtist = artistRepository.save(artist);
        return mapToResponseDTO(savedArtist);
    }

    public List<ArtistResponseDTO> getAllArtists() {
        return artistRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public ArtistResponseDTO getArtistById(Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found with id: " + id));

        return mapToResponseDTO(artist);
    }

    public ArtistResponseDTO updateArtist(Long id, ArtistRequestDTO requestDTO) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found with id: " + id));

        if (!artist.getEmail().equals(requestDTO.getEmail())) {
            artistRepository.findByEmail(requestDTO.getEmail()).ifPresent(existing -> {
                throw new RuntimeException("Another artist with this email already exists");
            });
        }

        artist.setArtistName(requestDTO.getArtistName());
        artist.setCategory(requestDTO.getCategory());
        artist.setEmail(requestDTO.getEmail());
        artist.setPhoneNumber(requestDTO.getPhoneNumber());
        artist.setBio(requestDTO.getBio());
        artist.setPortfolioLink(requestDTO.getPortfolioLink());
        artist.setSocialLink(requestDTO.getSocialLink());
        artist.setPerformancePreferences(requestDTO.getPerformancePreferences());

        Artist updatedArtist = artistRepository.save(artist);
        return mapToResponseDTO(updatedArtist);
    }

    public String deleteArtist(Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found with id: " + id));

        artistRepository.delete(artist);
        return "Artist deleted successfully";
    }

    private ArtistResponseDTO mapToResponseDTO(Artist artist) {
        return new ArtistResponseDTO(
                artist.getId(),
                artist.getArtistName(),
                artist.getCategory(),
                artist.getEmail(),
                artist.getPhoneNumber(),
                artist.getBio(),
                artist.getPortfolioLink(),
                artist.getSocialLink(),
                artist.getPerformancePreferences(),
                artist.getActive()
        );
    }
}