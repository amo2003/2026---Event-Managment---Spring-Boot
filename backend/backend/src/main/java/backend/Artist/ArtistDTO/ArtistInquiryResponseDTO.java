package backend.Artist.ArtistDTO;

import backend.Artist.ArtistEnums.InquiryStatus;

import java.time.LocalDateTime;

public class ArtistInquiryResponseDTO {

    private Long id;
    private Long artistId;
    private String artistName;
    private Long eventId;
    private String eventName;
    private String venue;
    private LocalDateTime eventDateTime;
    private String organizerMessage;
    private InquiryStatus status;
    private String responseMessage;
    private LocalDateTime sentAt;
    private LocalDateTime respondedAt;

    public ArtistInquiryResponseDTO() {
    }

    public ArtistInquiryResponseDTO(Long id, Long artistId, String artistName, Long eventId,
                                    String eventName, String venue, LocalDateTime eventDateTime,
                                    String organizerMessage, InquiryStatus status,
                                    String responseMessage, LocalDateTime sentAt,
                                    LocalDateTime respondedAt) {
        this.id = id;
        this.artistId = artistId;
        this.artistName = artistName;
        this.eventId = eventId;
        this.eventName = eventName;
        this.venue = venue;
        this.eventDateTime = eventDateTime;
        this.organizerMessage = organizerMessage;
        this.status = status;
        this.responseMessage = responseMessage;
        this.sentAt = sentAt;
        this.respondedAt = respondedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getArtistId() {
        return artistId;
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

    public InquiryStatus getStatus() {
        return status;
    }

    public String getResponseMessage() {
        return responseMessage;
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

    public void setArtistId(Long artistId) {
        this.artistId = artistId;
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

    public void setStatus(InquiryStatus status) {
        this.status = status;
    }

    public void setResponseMessage(String responseMessage) {
        this.responseMessage = responseMessage;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }
}