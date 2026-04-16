package backend.Society_Stall.Service;

import backend.Society_Stall.dto.EventDTO;
import backend.Society_Stall.enums.EventStatus;
import backend.Society_Stall.exception.EventNotFoundException;
import backend.Society_Stall.exception.SlotUnavailableException;
import backend.Society_Stall.model.EventCalender;
import backend.Society_Stall.model.EventModel;
import backend.Society_Stall.model.SocietyModel;
import backend.Society_Stall.repository.EventCalendarRepository;
import backend.Society_Stall.repository.SocietyEventRepository;
import backend.Society_Stall.repository.SocietyRepository;

import backend.Artist.ArtistEnums.ArtistCategory;
import backend.Artist.ArtistModel.ArtistLead;
import backend.Artist.ArtistRepository.ArtistLeadRepository;
import backend.Artist.ArtistRepository.ArtistRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final SocietyEventRepository eventRepo;
    private final EventCalendarRepository calendarRepo;
    private final SocietyRepository societyRepo;
    private final ArtistRepository artistRepository;
    private final ArtistLeadRepository artistLeadRepository;

    public EventService(SocietyEventRepository eventRepo,
                        EventCalendarRepository calendarRepo,
                        SocietyRepository societyRepo,
                        ArtistRepository artistRepository,
                        ArtistLeadRepository artistLeadRepository) {
        this.eventRepo = eventRepo;
        this.calendarRepo = calendarRepo;
        this.societyRepo = societyRepo;
        this.artistRepository = artistRepository;
        this.artistLeadRepository = artistLeadRepository;
    }

    public EventModel createEvent(EventModel event) {
        event.setStatus(EventStatus.PENDING);
        return eventRepo.save(event);
    }

    public List<EventModel> getSocietyEvents(Long societyId) {
        return eventRepo.findBySocietyId(societyId);
    }

    public List<EventModel> getPendingEvents() {
        return eventRepo.findByStatus(EventStatus.PENDING);
    }

    public List<EventModel> getAllEvents() {
        return eventRepo.findAll();
    }

    public EventModel getEvent(Long id) {
        return eventRepo.findById(id)
                .orElseThrow(() -> new EventNotFoundException(id));
    }

    public EventModel approveEvent(Long id) {
        EventModel event = getEvent(id);

        boolean busy = calendarRepo.existsByEventDateAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                event.getEventDate(),
                event.getStartTime(),
                event.getEndTime()
        );

        if (busy) {
            throw new SlotUnavailableException();
        }

        event.setStatus(EventStatus.CONFIRMED);
        event.setAdminMessage("Event Scheduled Successfully");

        EventModel updatedEvent = eventRepo.save(event);

        EventCalender cal = new EventCalender();
        cal.setEventId(updatedEvent.getId());
        cal.setEventDate(updatedEvent.getEventDate());
        cal.setStartTime(updatedEvent.getStartTime());
        cal.setEndTime(updatedEvent.getEndTime());
        cal.setVenue(updatedEvent.getVenue());
        cal.setContactNumber(updatedEvent.getContactNumber());
        cal.setEventName(updatedEvent.getEventName());

        calendarRepo.save(cal);

        return updatedEvent;
    }

    public EventModel rejectEvent(Long id, String message) {
        EventModel event = getEvent(id);
        event.setStatus(EventStatus.REJECTED);
        event.setAdminMessage(message);
        return eventRepo.save(event);
    }

    public EventModel updateArtists(Long id, String artists) {
        EventModel event = getEvent(id);
        event.setArtists(artists);

        EventModel updatedEvent = eventRepo.save(event);

        autoCreateMissingArtistLeads(artists);

        return updatedEvent;
    }

    private void autoCreateMissingArtistLeads(String artists) {
        if (artists == null || artists.trim().isEmpty()) {
            return;
        }

        List<String> artistNames = Arrays.stream(artists.split(","))
                .map(String::trim)
                .filter(name -> !name.isEmpty())
                .distinct()
                .collect(Collectors.toList());

        for (String artistName : artistNames) {
            boolean existsInArtists = artistRepository
                    .findByArtistNameIgnoreCase(artistName)
                    .isPresent();

            boolean existsInLeads = artistLeadRepository
                    .findByArtistNameIgnoreCase(artistName)
                    .isPresent();

            if (!existsInArtists && !existsInLeads) {
                ArtistLead lead = new ArtistLead();
                lead.setArtistName(artistName);
                lead.setCategory(ArtistCategory.BAND);
                lead.setEmail(generatePlaceholderEmail(artistName));
                lead.setPhoneNumber("");
                lead.setNotes("Auto-created from event artist list.");
                lead.setConvertedToArtist(false);

                artistLeadRepository.save(lead);
            }
        }
    }

    private String generatePlaceholderEmail(String artistName) {
        String base = artistName == null ? "artist" : artistName
                .trim()
                .toLowerCase()
                .replaceAll("\\s+", ".")
                .replaceAll("[^a-z0-9.]", "");

        if (base.isBlank()) {
            base = "artist";
        }

        String email = base + "@autogenerated.local";
        int counter = 1;

        while (artistLeadRepository.findByEmail(email).isPresent()) {
            email = base + counter + "@autogenerated.local";
            counter++;
        }

        return email;
    }

    @Transactional
    public void deleteEvent(Long id) {
        EventModel event = getEvent(id);
        calendarRepo.deleteByEventId(id);
        eventRepo.delete(event);
    }

    public List<EventDTO> getUpcomingEvents() {
        LocalDate today = LocalDate.now();
        List<EventModel> events = eventRepo.findByStatusAndEventDateGreaterThanEqualOrderByEventDateAsc(
                EventStatus.CONFIRMED, today);
        return events.stream()
                .map(this::toEventDTO)
                .collect(Collectors.toList());
    }

    public List<EventDTO> getPastEvents() {
        LocalDate today = LocalDate.now();
        List<EventModel> events = eventRepo.findByStatusAndEventDateLessThanOrderByEventDateDesc(
                EventStatus.CONFIRMED, today);
        return events.stream()
                .map(this::toEventDTO)
                .collect(Collectors.toList());
    }

    public EventDTO getEventWithSociety(Long id) {
        EventModel event = getEvent(id);
        return toEventDTO(event);
    }

    public List<EventDTO> getConfirmedEventsBySociety(Long societyId) {
        List<EventModel> events = eventRepo.findBySocietyIdAndStatus(societyId, EventStatus.CONFIRMED);
        return events.stream()
                .map(this::toEventDTO)
                .collect(Collectors.toList());
    }

    private EventDTO toEventDTO(EventModel event) {
        String societyName = "Unknown Society";
        if (event.getSocietyId() != null) {
            SocietyModel society = societyRepo.findById(event.getSocietyId()).orElse(null);
            if (society != null) {
                societyName = society.getName();
            }
        }
        return new EventDTO(event, societyName);
    }
}