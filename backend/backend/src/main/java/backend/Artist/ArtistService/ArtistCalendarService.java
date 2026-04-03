package backend.Service.ArtistService;

import backend.dto.ArtistDTO.ArtistCalendarEventDTO;
import backend.enums.ArtistEnums.CalendarSyncStatus;
import backend.model.ArtistModel.ArtistCalendarEvent;
import backend.repository.ArtistRepository.ArtistCalendarEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArtistCalendarService {

    private final ArtistCalendarEventRepository artistCalendarEventRepository;

    public ArtistCalendarService(ArtistCalendarEventRepository artistCalendarEventRepository) {
        this.artistCalendarEventRepository = artistCalendarEventRepository;
    }

    public ArtistCalendarEventDTO addEventToCalendar(ArtistCalendarEventDTO requestDTO) {
        boolean conflictExists = artistCalendarEventRepository.existsByArtistIdAndEventDateTime(
                requestDTO.getArtistId(),
                requestDTO.getEventDateTime()
        );

        if (conflictExists) {
            throw new RuntimeException("Artist already has an event at this date and time");
        }

        ArtistCalendarEvent calendarEvent = new ArtistCalendarEvent();
        calendarEvent.setArtistId(requestDTO.getArtistId());
        calendarEvent.setEventId(requestDTO.getEventId());
        calendarEvent.setEventName(requestDTO.getEventName());
        calendarEvent.setVenue(requestDTO.getVenue());
        calendarEvent.setEventDateTime(requestDTO.getEventDateTime());
        calendarEvent.setSyncStatus(CalendarSyncStatus.INTERNAL_ONLY);

        ArtistCalendarEvent saved = artistCalendarEventRepository.save(calendarEvent);

        return mapToDTO(saved);
    }

    public List<ArtistCalendarEventDTO> getCalendarByArtist(Long artistId) {
        return artistCalendarEventRepository.findByArtistId(artistId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public String checkConflict(Long artistId, String eventDateTime) {
        boolean exists = artistCalendarEventRepository.existsByArtistIdAndEventDateTime(
                artistId,
                java.time.LocalDateTime.parse(eventDateTime)
        );

        return exists ? "Conflict exists" : "No conflict";
    }

    private ArtistCalendarEventDTO mapToDTO(ArtistCalendarEvent event) {
        return new ArtistCalendarEventDTO(
                event.getId(),
                event.getArtistId(),
                event.getEventId(),
                event.getEventName(),
                event.getVenue(),
                event.getEventDateTime(),
                event.getSyncStatus()
        );
    }
}