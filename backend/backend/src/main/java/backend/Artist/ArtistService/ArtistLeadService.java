package backend.Service.ArtistService;

import backend.dto.ArtistDTO.ArtistLeadRequestDTO;
import backend.dto.ArtistDTO.ArtistLeadResponseDTO;
import backend.model.ArtistModel.ArtistLead;
import backend.repository.ArtistRepository.ArtistLeadRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArtistLeadService {

    private final ArtistLeadRepository artistLeadRepository;

    public ArtistLeadService(ArtistLeadRepository artistLeadRepository) {
        this.artistLeadRepository = artistLeadRepository;
    }

    public ArtistLeadResponseDTO createLead(ArtistLeadRequestDTO requestDTO) {
        if (artistLeadRepository.findByEmail(requestDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Artist lead with this email already exists");
        }

        ArtistLead lead = new ArtistLead();
        lead.setArtistName(requestDTO.getArtistName());
        lead.setCategory(requestDTO.getCategory());
        lead.setEmail(requestDTO.getEmail());
        lead.setPhoneNumber(requestDTO.getPhoneNumber());
        lead.setNotes(requestDTO.getNotes());
        lead.setConvertedToArtist(false);

        ArtistLead savedLead = artistLeadRepository.save(lead);
        return mapToResponseDTO(savedLead);
    }

    public List<ArtistLeadResponseDTO> getAllLeads() {
        return artistLeadRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public ArtistLeadResponseDTO getLeadById(Long id) {
        ArtistLead lead = artistLeadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist lead not found with id: " + id));

        return mapToResponseDTO(lead);
    }

    public ArtistLeadResponseDTO updateLead(Long id, ArtistLeadRequestDTO requestDTO) {
        ArtistLead lead = artistLeadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist lead not found with id: " + id));

        if (!lead.getEmail().equals(requestDTO.getEmail())) {
            artistLeadRepository.findByEmail(requestDTO.getEmail()).ifPresent(existing -> {
                throw new RuntimeException("Another artist lead with this email already exists");
            });
        }

        lead.setArtistName(requestDTO.getArtistName());
        lead.setCategory(requestDTO.getCategory());
        lead.setEmail(requestDTO.getEmail());
        lead.setPhoneNumber(requestDTO.getPhoneNumber());
        lead.setNotes(requestDTO.getNotes());

        ArtistLead updatedLead = artistLeadRepository.save(lead);
        return mapToResponseDTO(updatedLead);
    }

    public String deleteLead(Long id) {
        ArtistLead lead = artistLeadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist lead not found with id: " + id));

        artistLeadRepository.delete(lead);
        return "Artist lead deleted successfully";
    }

    private ArtistLeadResponseDTO mapToResponseDTO(ArtistLead lead) {
        return new ArtistLeadResponseDTO(
                lead.getId(),
                lead.getArtistName(),
                lead.getCategory(),
                lead.getEmail(),
                lead.getPhoneNumber(),
                lead.getNotes(),
                lead.getConvertedToArtist()
        );
    }
}