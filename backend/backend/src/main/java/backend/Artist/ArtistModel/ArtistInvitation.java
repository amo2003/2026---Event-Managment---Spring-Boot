package backend.model.ArtistModel;

import backend.enums.ArtistEnums.InvitationStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "artist_invitations")
public class ArtistInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "artist_lead_id")
    private ArtistLead artistLead;

    @Column(nullable = false)
    private Long eventId;

    @Column(nullable = false)
    private String eventName;

    @Column(nullable = false)
    private String venue;

    @Column(nullable = false)
    private LocalDateTime eventDateTime;

    @Column(length = 1000)
    private String organizerMessage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvitationStatus status = InvitationStatus.PENDING;

    @Column(length = 1000)
    private String declineReason;

    @Column(nullable = false)
    private LocalDateTime sentAt = LocalDateTime.now();

    private LocalDateTime respondedAt;

    public ArtistInvitation() {
    }

    public Long getId() {
        return id;
    }

    public ArtistLead getArtistLead() {
        return artistLead;
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

    public void setArtistLead(ArtistLead artistLead) {
        this.artistLead = artistLead;
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