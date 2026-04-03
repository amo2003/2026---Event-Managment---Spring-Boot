package backend.Service.ArtistService;

import backend.dto.ArtistDTO.ArtistInquiryActionDTO;
import backend.dto.ArtistDTO.ArtistInquiryRequestDTO;
import backend.dto.ArtistDTO.ArtistInquiryResponseDTO;
import backend.enums.ArtistEnums.InquiryStatus;
import backend.model.ArtistModel.Artist;
import backend.model.ArtistModel.ArtistInquiry;
import backend.repository.ArtistRepository.ArtistInquiryRepository;
import backend.repository.ArtistRepository.ArtistRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArtistInquiryService {

    private final ArtistInquiryRepository artistInquiryRepository;
    private final ArtistRepository artistRepository;

    public ArtistInquiryService(ArtistInquiryRepository artistInquiryRepository,
                                ArtistRepository artistRepository) {
        this.artistInquiryRepository = artistInquiryRepository;
        this.artistRepository = artistRepository;
    }

    public ArtistInquiryResponseDTO sendInquiry(ArtistInquiryRequestDTO requestDTO) {
        Artist artist = artistRepository.findById(requestDTO.getArtistId())
                .orElseThrow(() -> new RuntimeException("Artist not found with id: " + requestDTO.getArtistId()));

        ArtistInquiry inquiry = new ArtistInquiry();
        inquiry.setArtist(artist);
        inquiry.setEventId(requestDTO.getEventId());
        inquiry.setEventName(requestDTO.getEventName());
        inquiry.setVenue(requestDTO.getVenue());
        inquiry.setEventDateTime(requestDTO.getEventDateTime());
        inquiry.setOrganizerMessage(requestDTO.getOrganizerMessage());
        inquiry.setStatus(InquiryStatus.PENDING);
        inquiry.setSentAt(LocalDateTime.now());

        ArtistInquiry savedInquiry = artistInquiryRepository.save(inquiry);
        return mapToResponseDTO(savedInquiry);
    }

    public List<ArtistInquiryResponseDTO> getInquiriesByArtist(Long artistId) {
        return artistInquiryRepository.findByArtistId(artistId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ArtistInquiryResponseDTO> getInquiriesByEvent(Long eventId) {
        return artistInquiryRepository.findByEventId(eventId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public ArtistInquiryResponseDTO respondToInquiry(Long inquiryId, ArtistInquiryActionDTO actionDTO) {
        ArtistInquiry inquiry = artistInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new RuntimeException("Inquiry not found with id: " + inquiryId));

        if (actionDTO.getStatus() != InquiryStatus.INTERESTED &&
            actionDTO.getStatus() != InquiryStatus.NOT_INTERESTED) {
            throw new RuntimeException("Invalid inquiry response status");
        }

        inquiry.setStatus(actionDTO.getStatus());
        inquiry.setResponseMessage(actionDTO.getResponseMessage());
        inquiry.setRespondedAt(LocalDateTime.now());

        ArtistInquiry updatedInquiry = artistInquiryRepository.save(inquiry);
        return mapToResponseDTO(updatedInquiry);
    }

    private ArtistInquiryResponseDTO mapToResponseDTO(ArtistInquiry inquiry) {
        return new ArtistInquiryResponseDTO(
                inquiry.getId(),
                inquiry.getArtist().getId(),
                inquiry.getArtist().getArtistName(),
                inquiry.getEventId(),
                inquiry.getEventName(),
                inquiry.getVenue(),
                inquiry.getEventDateTime(),
                inquiry.getOrganizerMessage(),
                inquiry.getStatus(),
                inquiry.getResponseMessage(),
                inquiry.getSentAt(),
                inquiry.getRespondedAt()
        );
    }
}