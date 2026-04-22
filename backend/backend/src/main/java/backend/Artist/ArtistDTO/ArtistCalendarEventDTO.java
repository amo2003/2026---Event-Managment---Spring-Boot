package backend.Artist.ArtistDTO;

import backend.Artist.ArtistEnums.CalendarSyncStatus;

import java.time.LocalDateTime;

public class ArtistCalendarEventDTO {

    private Long id;
    private Long artistId;
    private Long eventId;
    private String eventName;
    private String venue;
    private LocalDateTime eventDateTime;
    private CalendarSyncStatus syncStatus;

    public ArtistCalendarEventDTO() {
    }

    public ArtistCalendarEventDTO(Long id, Long artistId, Long eventId, String eventName,
                                  String venue, LocalDateTime eventDateTime,
                                  CalendarSyncStatus syncStatus) {
        this.id = id;
        this.artistId = artistId;
        this.eventId = eventId;
        this.eventName = eventName;
        this.venue = venue;
        this.eventDateTime = eventDateTime;
        this.syncStatus = syncStatus;
    }

    public Long getId() {
        return id;
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

    public CalendarSyncStatus getSyncStatus() {
        return syncStatus;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setSyncStatus(CalendarSyncStatus syncStatus) {
        this.syncStatus = syncStatus;
    }
}