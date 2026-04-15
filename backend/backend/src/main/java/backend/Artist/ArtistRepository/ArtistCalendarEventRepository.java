package backend.Artist.ArtistRepository;

import backend.Artist.ArtistEnums.CalendarSyncStatus;
import backend.Artist.ArtistModel.ArtistCalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ArtistCalendarEventRepository extends JpaRepository<ArtistCalendarEvent, Long> {

    List<ArtistCalendarEvent> findByArtistId(Long artistId);

    boolean existsByArtistIdAndEventDateTime(Long artistId, LocalDateTime eventDateTime);

    
    List<ArtistCalendarEvent> findBySyncStatus(CalendarSyncStatus syncStatus);
}