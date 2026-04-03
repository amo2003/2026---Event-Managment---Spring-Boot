package backend.Service.ArtistService;

import backend.dto.ArtistDTO.ArtistInvitationActionDTO;
import backend.dto.ArtistDTO.ArtistInvitationRequestDTO;
import backend.dto.ArtistDTO.ArtistInvitationResponseDTO;
import backend.enums.ArtistEnums.InvitationStatus;
import backend.model.ArtistModel.ArtistInvitation;
import backend.model.ArtistModel.ArtistLead;
import backend.repository.ArtistRepository.ArtistInvitationRepository;
import backend.repository.ArtistRepository.ArtistLeadRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArtistInvitationService {

    private final ArtistInvitationRepository artistInvitationRepository;
    private final ArtistLeadRepository artistLeadRepository;

    public ArtistInvitationService(ArtistInvitationRepository artistInvitationRepository,
                                   ArtistLeadRepository artistLeadRepository) {
        this.artistInvitationRepository = artistInvitationRepository;
        this.artistLeadRepository = artistLeadRepository;
    }

    public ArtistInvitationResponseDTO sendInvitation(ArtistInvitationRequestDTO requestDTO) {
        ArtistLead artistLead = artistLeadRepository.findById(requestDTO.getArtistLeadId())
                .orElseThrow(() -> new RuntimeException("Artist lead not found with id: " + requestDTO.getArtistLeadId()));

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

    public ArtistInvitationResponseDTO finalizeInvitation(Long invitationId) {
        ArtistInvitation invitation = artistInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found with id: " + invitationId));

        if (invitation.getStatus() != InvitationStatus.ACCEPTED) {
            throw new RuntimeException("Only accepted invitations can be finalized");
        }

        invitation.setStatus(InvitationStatus.FINALIZED);
        ArtistInvitation updatedInvitation = artistInvitationRepository.save(invitation);
        return mapToResponseDTO(updatedInvitation);
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