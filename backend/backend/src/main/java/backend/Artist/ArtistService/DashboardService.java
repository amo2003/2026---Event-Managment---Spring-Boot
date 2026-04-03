package backend.Service.ArtistService;

import backend.dto.ArtistDTO.ArtistVoteResponseDTO;
import backend.dto.ArtistDTO.DashboardSummaryDTO;
import backend.enums.ArtistEnums.InquiryStatus;
import backend.enums.ArtistEnums.InvitationStatus;
import backend.model.ArtistModel.ArtistCalendarEvent;
import backend.model.ArtistModel.ArtistInquiry;
import backend.model.ArtistModel.ArtistInvitation;
import backend.repository.ArtistRepository.ArtistCalendarEventRepository;
import backend.repository.ArtistRepository.ArtistInquiryRepository;
import backend.repository.ArtistRepository.ArtistInvitationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ArtistInquiryRepository artistInquiryRepository;
    private final ArtistInvitationRepository artistInvitationRepository;
    private final ArtistCalendarEventRepository artistCalendarEventRepository;
    private final ArtistVoteService artistVoteService;

    public DashboardService(ArtistInquiryRepository artistInquiryRepository,
                            ArtistInvitationRepository artistInvitationRepository,
                            ArtistCalendarEventRepository artistCalendarEventRepository,
                            ArtistVoteService artistVoteService) {
        this.artistInquiryRepository = artistInquiryRepository;
        this.artistInvitationRepository = artistInvitationRepository;
        this.artistCalendarEventRepository = artistCalendarEventRepository;
        this.artistVoteService = artistVoteService;
    }

    public DashboardSummaryDTO getSummaryByEvent(Long eventId) {
        List<ArtistInquiry> inquiries = artistInquiryRepository.findByEventId(eventId);
        List<ArtistInvitation> invitations = artistInvitationRepository.findByEventId(eventId);

        List<ArtistCalendarEvent> calendarEvents = artistCalendarEventRepository.findAll()
                .stream()
                .filter(event -> event.getEventId().equals(eventId))
                .collect(Collectors.toList());

        List<ArtistVoteResponseDTO> voteResults = artistVoteService.getVoteResults(eventId);

        DashboardSummaryDTO dto = new DashboardSummaryDTO();
        dto.setEventId(eventId);

        dto.setTotalInquiries(inquiries.size());
        dto.setInterestedCount(inquiries.stream().filter(i -> i.getStatus() == InquiryStatus.INTERESTED).count());
        dto.setNotInterestedCount(inquiries.stream().filter(i -> i.getStatus() == InquiryStatus.NOT_INTERESTED).count());
        dto.setPendingInquiryCount(inquiries.stream().filter(i -> i.getStatus() == InquiryStatus.PENDING).count());

        dto.setTotalInvitations(invitations.size());
        dto.setAcceptedCount(invitations.stream().filter(i -> i.getStatus() == InvitationStatus.ACCEPTED).count());
        dto.setDeclinedCount(invitations.stream().filter(i -> i.getStatus() == InvitationStatus.DECLINED).count());
        dto.setFinalizedCount(invitations.stream().filter(i -> i.getStatus() == InvitationStatus.FINALIZED).count());

        dto.setCalendarConfirmedCount(calendarEvents.size());
        dto.setVoteResults(voteResults);

        return dto;
    }
}