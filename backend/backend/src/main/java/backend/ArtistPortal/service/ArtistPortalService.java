package backend.ArtistPortal.service;

import backend.Artist.ArtistEnums.InvitationStatus;
import backend.Artist.ArtistModel.Artist;
import backend.Artist.ArtistModel.ArtistInvitation;
import backend.Artist.ArtistRepository.ArtistInvitationRepository;
import backend.Artist.ArtistRepository.ArtistRepository;
import backend.ArtistPortal.dto.ArtistPortalFeedbackDTO;
import backend.ArtistPortal.dto.ArtistPortalLoginDTO;
import backend.ArtistPortal.dto.ArtistPortalRegisterDTO;
import backend.ArtistPortal.model.ArtistPortalAccount;
import backend.ArtistPortal.model.ArtistPortalFeedback;
import backend.ArtistPortal.repository.ArtistPortalAccountRepository;
import backend.ArtistPortal.repository.ArtistPortalFeedbackRepository;
import backend.Society_Stall.model.EventCalender;
import backend.ArtistPortal.dto.ArtistPortalResetPasswordDTO;
import backend.Society_Stall.repository.EventCalendarRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ArtistPortalService {

    private final ArtistPortalAccountRepository accountRepository;
    private final ArtistPortalFeedbackRepository feedbackRepository;
    private final ArtistRepository artistRepository;
    private final ArtistInvitationRepository invitationRepository;
    private final EventCalendarRepository eventRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public ArtistPortalService(
            ArtistPortalAccountRepository accountRepository,
            ArtistPortalFeedbackRepository feedbackRepository,
            ArtistRepository artistRepository,
            ArtistInvitationRepository invitationRepository,
            EventCalendarRepository eventRepository
    ) {
        this.accountRepository = accountRepository;
        this.feedbackRepository = feedbackRepository;
        this.artistRepository = artistRepository;
        this.invitationRepository = invitationRepository;
        this.eventRepository = eventRepository;
    }

    public String register(ArtistPortalRegisterDTO dto) {
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }

        if (dto.getPassword() == null || dto.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        String email = dto.getEmail().trim().toLowerCase();

        if (accountRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Account already exists");
        }

        Artist artist = artistRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No finalized artist found with this email"));

        List<ArtistInvitation> finalizedInvitations = invitationRepository.findAll().stream()
                .filter(inv -> inv.getArtistLead() != null)
                .filter(inv -> inv.getStatus() == InvitationStatus.FINALIZED)
                .filter(inv -> inv.getArtistLead().getArtistName() != null)
                .filter(inv -> artist.getArtistName() != null)
                .filter(inv -> inv.getArtistLead().getArtistName().trim().equalsIgnoreCase(artist.getArtistName().trim()))
                .toList();

        if (finalizedInvitations.isEmpty()) {
            throw new RuntimeException("Artist is not finalized for any event yet");
        }

        ArtistPortalAccount account = new ArtistPortalAccount();
        account.setArtistId(artist.getId());
        account.setEmail(email);
        account.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        account.setActive(true);
        account.setFeedbackSubmitted(false);

        accountRepository.save(account);

        return "Artist account created successfully";
    }

    public Map<String, Object> login(ArtistPortalLoginDTO dto) {
        ArtistPortalAccount account = accountRepository.findByEmail(dto.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!account.isActive()) {
            throw new RuntimeException("This account is inactive");
        }

        if (!passwordEncoder.matches(dto.getPassword(), account.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        Artist artist = artistRepository.findById(account.getArtistId())
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("artistId", artist.getId());
        response.put("accountId", account.getId());
        response.put("artistName", artist.getArtistName());
        response.put("email", account.getEmail());
        response.put("active", account.isActive());

        return response;
    }

    public Map<String, Object> getDashboard(Long artistId) {
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        ArtistPortalAccount account = accountRepository.findByArtistId(artistId)
                .orElseThrow(() -> new RuntimeException("Artist account not found"));

        List<ArtistInvitation> finalizedInvitations = invitationRepository.findAll().stream()
                .filter(inv -> inv.getArtistLead() != null)
                .filter(inv -> inv.getStatus() == InvitationStatus.FINALIZED)
                .filter(inv -> inv.getArtistLead().getArtistName() != null)
                .filter(inv -> artist.getArtistName() != null)
                .filter(inv -> inv.getArtistLead().getArtistName().trim().equalsIgnoreCase(artist.getArtistName().trim()))
                .sorted(Comparator.comparing(ArtistInvitation::getEventDateTime))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("artistId", artist.getId());
        response.put("artistName", artist.getArtistName());
        response.put("email", artist.getEmail());
        response.put("category", artist.getCategory());
        response.put("active", account.isActive());
        response.put("feedbackSubmitted", account.isFeedbackSubmitted());

        if (!finalizedInvitations.isEmpty()) {
            ArtistInvitation latest = finalizedInvitations.get(0);

           Map<String, Object> event = new HashMap<>();
            event.put("invitationId", latest.getId());
            event.put("eventId", latest.getEventId());
            event.put("eventName", latest.getEventName());
            event.put("venue", latest.getVenue());
            event.put("eventDateTime", latest.getEventDateTime());
            event.put("organizerMessage", latest.getOrganizerMessage());

            response.put("assignedEvent", event);
        } else {
            response.put("assignedEvent", null);
        }

        return response;
    }

    public String submitFeedback(ArtistPortalFeedbackDTO dto) {
        ArtistPortalAccount account = accountRepository.findByArtistId(dto.getArtistId())
                .orElseThrow(() -> new RuntimeException("Artist account not found"));

        if (!account.isActive()) {
            throw new RuntimeException("This account is inactive");
        }

        if (feedbackRepository.findByArtistIdAndEventId(dto.getArtistId(), dto.getEventId()).isPresent()) {
            throw new RuntimeException("Feedback already submitted for this event");
        }

        EventCalender event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        LocalDateTime eventEndDateTime = LocalDateTime.of(
                event.getEventDate(),
                event.getEndTime()
        );

        if (LocalDateTime.now().isBefore(eventEndDateTime)) {
            throw new RuntimeException("Feedback can only be submitted after the event ends");
        }

        ArtistPortalFeedback feedback = new ArtistPortalFeedback();
        feedback.setArtistId(dto.getArtistId());
        feedback.setEventId(dto.getEventId());
        feedback.setRating(dto.getRating());
        feedback.setComments(dto.getComments());
        feedback.setWouldPerformAgain(dto.isWouldPerformAgain());
        feedback.setSubmittedAt(LocalDateTime.now());

        feedbackRepository.save(feedback);

        account.setFeedbackSubmitted(true);
        account.setActive(false);
        accountRepository.save(account);

        return "Feedback submitted successfully. Account has been deactivated.";
    }

    public String resetPassword(ArtistPortalResetPasswordDTO dto) {
    if (dto.getEmail() == null || dto.getEmail().isBlank()) {
        throw new RuntimeException("Email is required");
    }

    if (dto.getNewPassword() == null || dto.getNewPassword().isBlank()) {
        throw new RuntimeException("New password is required");
    }

    String password = dto.getNewPassword();

    if (password.length() < 8) {
        throw new RuntimeException("Password must be at least 8 characters");
    }

    if (!password.matches(".*[A-Z].*")) {
        throw new RuntimeException("Password must include at least 1 uppercase letter");
    }

    if (!password.matches(".*[a-z].*")) {
        throw new RuntimeException("Password must include at least 1 lowercase letter");
    }

    if (!password.matches(".*\\d.*")) {
        throw new RuntimeException("Password must include at least 1 number");
    }

    if (!password.matches(".*[!@#$%^&*(),.?\":{}|<>_\\-\\\\/\\[\\];'`~+=].*")) {
        throw new RuntimeException("Password must include at least 1 special character");
    }

    String email = dto.getEmail().trim().toLowerCase();

    ArtistPortalAccount account = accountRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("No artist account found with this email"));

    if (!account.isActive()) {
        throw new RuntimeException("This account is inactive and cannot reset password");
    }

    account.setPasswordHash(passwordEncoder.encode(password));
    accountRepository.save(account);

    return "Password reset successfully";
}
}