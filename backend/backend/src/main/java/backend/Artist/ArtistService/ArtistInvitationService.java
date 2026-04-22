package backend.Artist.ArtistService;

import backend.Artist.ArtistDTO.ArtistInvitationActionDTO;
import backend.Artist.ArtistDTO.ArtistInvitationRequestDTO;
import backend.Artist.ArtistDTO.ArtistInvitationResponseDTO;
import backend.Artist.ArtistEnums.InvitationStatus;
import backend.Artist.ArtistModel.Artist;
import backend.Artist.ArtistModel.ArtistInvitation;
import backend.Artist.ArtistModel.ArtistLead;
import backend.Artist.ArtistRepository.ArtistInvitationRepository;
import backend.Artist.ArtistRepository.ArtistLeadRepository;
import backend.Artist.ArtistRepository.ArtistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArtistInvitationService {

    private final ArtistInvitationRepository artistInvitationRepository;
    private final ArtistLeadRepository artistLeadRepository;
    private final ArtistRepository artistRepository;

    public ArtistInvitationService(ArtistInvitationRepository artistInvitationRepository,
                                   ArtistLeadRepository artistLeadRepository,
                                   ArtistRepository artistRepository) {
        this.artistInvitationRepository = artistInvitationRepository;
        this.artistLeadRepository = artistLeadRepository;
        this.artistRepository = artistRepository;
    }

    public ArtistInvitationResponseDTO sendInvitation(ArtistInvitationRequestDTO requestDTO) {
        ArtistLead artistLead = artistLeadRepository.findById(requestDTO.getArtistLeadId())
                .orElseThrow(() -> new RuntimeException(
                        "Artist lead not found with id: " + requestDTO.getArtistLeadId()
                ));

        ArtistInvitation invitation = new ArtistInvitation();
        invitation.setArtistLead(artistLead);
        invitation.setEventId(requestDTO.getEventId());
        invitation.setEventName(requestDTO.getEventName());
        invitation.setVenue(requestDTO.getVenue());
        invitation.setEventDateTime(requestDTO.getEventDateTime());
        invitation.setOrganizerMessage(requestDTO.getOrganizerMessage());
        invitation.setStatus(InvitationStatus.PENDING);
        invitation.setSentAt(LocalDateTime.now());

        ArtistInvitation savedInvitation = artistInvitationRepository.save(invitation);
        return mapToResponseDTO(savedInvitation);
    }

    public List<ArtistInvitationResponseDTO> getInvitationsByLead(Long artistLeadId) {
        return artistInvitationRepository.findByArtistLeadId(artistLeadId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ArtistInvitationResponseDTO> getInvitationsByEvent(Long eventId) {
        return artistInvitationRepository.findByEventId(eventId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ArtistInvitationResponseDTO> getFinalizedByEvent(Long eventId) {
        return artistInvitationRepository.findByEventId(eventId).stream()
                .filter(inv -> inv.getStatus() == InvitationStatus.FINALIZED)
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ArtistInvitationResponseDTO> getInvitationsByArtist(Long artistId) {
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new RuntimeException("Artist not found: " + artistId));
        return artistInvitationRepository.findAll().stream()
                .filter(inv -> inv.getArtistLead() != null &&
                        inv.getArtistLead().getArtistName()
                                .equalsIgnoreCase(artist.getArtistName()))
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public ArtistInvitationResponseDTO respondToInvitation(Long invitationId, ArtistInvitationActionDTO actionDTO) {
        ArtistInvitation invitation = artistInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found with id: " + invitationId));

        if (actionDTO.getStatus() != InvitationStatus.ACCEPTED &&
            actionDTO.getStatus() != InvitationStatus.DECLINED) {
            throw new RuntimeException("Invalid invitation response status");
        }

        invitation.setStatus(actionDTO.getStatus());
        invitation.setDeclineReason(actionDTO.getDeclineReason());
        invitation.setRespondedAt(LocalDateTime.now());

        ArtistInvitation updatedInvitation = artistInvitationRepository.save(invitation);
        return mapToResponseDTO(updatedInvitation);
    }

    @Transactional
    public ArtistInvitationResponseDTO finalizeInvitation(Long invitationId) {
        ArtistInvitation invitation = artistInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found with id: " + invitationId));

        if (invitation.getStatus() != InvitationStatus.ACCEPTED &&
            invitation.getStatus() != InvitationStatus.FINALIZED) {
            throw new RuntimeException("Only accepted invitations can be finalized");
        }

        ArtistLead lead = invitation.getArtistLead();

        Artist artist = artistRepository.findByArtistNameIgnoreCase(lead.getArtistName())
                .orElseGet(Artist::new);

        artist.setArtistName(lead.getArtistName());
        artist.setCategory(lead.getCategory());
        artist.setEmail(buildSafeArtistEmail(lead, artist.getId()));
        artist.setPhoneNumber(lead.getPhoneNumber());
        artist.setBio(lead.getNotes());
        artist.setPortfolioLink(artist.getPortfolioLink() == null ? "" : artist.getPortfolioLink());
        artist.setSocialLink(artist.getSocialLink() == null ? "" : artist.getSocialLink());
        artist.setPerformancePreferences(
                artist.getPerformancePreferences() == null ? "" : artist.getPerformancePreferences()
        );
        artist.setActive(true);

        Artist savedArtist = artistRepository.save(artist);

        lead.setConvertedToArtist(true);
        artistLeadRepository.save(lead);

        invitation.setStatus(InvitationStatus.FINALIZED);
        ArtistInvitation updatedInvitation = artistInvitationRepository.save(invitation);

        System.out.println("FINALIZE SUCCESS -> lead: " + lead.getArtistName()
                + ", artistId: " + savedArtist.getId());

        return mapToResponseDTO(updatedInvitation);
    }

    @Transactional
    public ArtistInvitationResponseDTO reconsiderInvitation(Long invitationId) {
        ArtistInvitation invitation = artistInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found with id: " + invitationId));

        if (invitation.getStatus() != InvitationStatus.FINALIZED) {
            throw new RuntimeException("Only finalized invitations can be reconsidered");
        }

        invitation.setStatus(InvitationStatus.ACCEPTED);

        ArtistInvitation updatedInvitation = artistInvitationRepository.save(invitation);
        return mapToResponseDTO(updatedInvitation);
    }

    @Transactional
    public ArtistInvitationResponseDTO removeInvitation(Long invitationId) {
        ArtistInvitation invitation = artistInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found with id: " + invitationId));

        if (invitation.getStatus() != InvitationStatus.FINALIZED) {
            throw new RuntimeException("Only finalized invitations can be removed");
        }

        invitation.setStatus(InvitationStatus.REMOVED);

        ArtistInvitation updatedInvitation = artistInvitationRepository.save(invitation);
        return mapToResponseDTO(updatedInvitation);
    }

    private String buildSafeArtistEmail(ArtistLead lead, Long currentArtistId) {
        String preferred = safeEmail(lead.getEmail(), lead.getArtistName());

        return artistRepository.findByEmail(preferred)
                .filter(existing -> currentArtistId == null || !existing.getId().equals(currentArtistId))
                .map(existing -> generateFallbackEmail(lead.getArtistName(), currentArtistId))
                .orElse(preferred);
    }

    private String safeEmail(String email, String artistName) {
        String cleaned = email == null ? "" : email.trim().toLowerCase();
        if (!cleaned.isBlank()) {
            return cleaned;
        }
        return generateFallbackEmail(artistName, null);
    }

    private String generateFallbackEmail(String artistName, Long currentArtistId) {
        String base = normalize(artistName).replace(" ", ".");
        if (base.isBlank()) {
            base = "artist";
        }

        String candidate = base + "@autogenerated.local";
        int counter = 1;

        while (artistRepository.findByEmail(candidate)
                .filter(existing -> currentArtistId == null || !existing.getId().equals(currentArtistId))
                .isPresent()) {
            candidate = base + counter + "@autogenerated.local";
            counter++;
        }

        return candidate;
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().replaceAll("\\s+", " ").toLowerCase();
    }

    private ArtistInvitationResponseDTO mapToResponseDTO(ArtistInvitation invitation) {
        return new ArtistInvitationResponseDTO(
                invitation.getId(),
                invitation.getArtistLead().getId(),
                invitation.getArtistLead().getArtistName(),
                invitation.getEventId(),
                invitation.getEventName(),
                invitation.getVenue(),
                invitation.getEventDateTime(),
                invitation.getOrganizerMessage(),
                invitation.getStatus(),
                invitation.getDeclineReason(),
                invitation.getSentAt(),
                invitation.getRespondedAt()
        );
    }
}