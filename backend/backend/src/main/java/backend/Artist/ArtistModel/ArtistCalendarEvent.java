package backend.model.ArtistModel;

import backend.enums.ArtistEnums.CalendarSyncStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "artist_calendar_events")
public class ArtistCalendarEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long artistId;

    @Column(nullable = false)
    private Long eventId;

    @Column(nullable = false)
    private String eventName;

    @Column(nullable = false)
    private String venue;

    @Column(nullable = false)
    private LocalDateTime eventDateTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CalendarSyncStatus syncStatus = CalendarSyncStatus.INTERNAL_ONLY;

    public ArtistCalendarEvent() {
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