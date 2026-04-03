package backend.dto.ArtistDTO;

import backend.enums.ArtistEnums.InvitationStatus;

import java.time.LocalDateTime;

public class ArtistInvitationResponseDTO {

    private Long id;
    private Long artistLeadId;
    private String artistName;
    private Long eventId;
    private String eventName;
    private String venue;
    private LocalDateTime eventDateTime;
    private String organizerMessage;
    private InvitationStatus status;
    private String declineReason;
    private LocalDateTime sentAt;
    private LocalDateTime respondedAt;

    public ArtistInvitationResponseDTO() {
    }

    public ArtistInvitationResponseDTO(Long id, Long artistLeadId, String artistName, Long eventId,
                                       String eventName, String venue, LocalDateTime eventDateTime,
                                       String organizerMessage, InvitationStatus status,
                                       String declineReason, LocalDateTime sentAt,
                                       LocalDateTime respondedAt) {
        this.id = id;
        this.artistLeadId = artistLeadId;
        this.artistName = artistName;
        this.eventId = eventId;
        this.eventName = eventName;
        this.venue = venue;
        this.eventDateTime = eventDateTime;
        this.organizerMessage = organizerMessage;
        this.status = status;
        this.declineReason = declineReason;
        this.sentAt = sentAt;
        this.respondedAt = respondedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getArtistLeadId() {
        return artistLeadId;
    }

    public String getArtistName() {
        return artistName;
    }

    public Long getEventId() {
        return eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public String getVenue() {
        return venue;
    }

    public LocalDateTime getEventDateTime() {
        return eventDateTime;
    }

    public String getOrganizerMessage() {
        return organizerMessage;
    }

    public InvitationStatus getStatus() {
        return status;
    }

    public String getDeclineReason() {
        return declineReason;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setArtistLeadId(Long artistLeadId) {
        this.artistLeadId = artistLeadId;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public void setEventDateTime(LocalDateTime eventDateTime) {
        this.eventDateTime = eventDateTime;
    }

    public void setOrganizerMessage(String organizerMessage) {
        this.organizerMessage = organizerMessage;
    }

    public void setStatus(InvitationStatus status) {
        this.status = status;
    }

    public void setDeclineReason(String declineReason) {
        this.declineReason = declineReason;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }
}