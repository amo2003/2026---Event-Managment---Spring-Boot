package backend.dto.ArtistDTO;

import java.time.LocalDateTime;

public class ArtistInquiryRequestDTO {

    private Long artistId;
    private Long eventId;
    private String eventName;
    private String venue;
    private LocalDateTime eventDateTime;
    private String organizerMessage;

    public ArtistInquiryRequestDTO() {
    }

    public Long getArtistId() {
        return artistId;
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

    public void setArtistId(Long artistId) {
        this.artistId = artistId;
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
}