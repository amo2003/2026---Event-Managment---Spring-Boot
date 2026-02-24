package backend.Service;

import backend.dto.EventDTO;
import backend.enums.EventStatus;
import backend.exception.EventNotFoundException;
import backend.exception.SlotUnavailableException;
import backend.model.EventCalender;
import backend.model.EventModel;
import backend.model.SocietyModel;
import backend.repository.EventCalendarRepository;
import backend.repository.SocietyEventRepository;
import backend.repository.SocietyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final SocietyEventRepository eventRepo;
    private final EventCalendarRepository calendarRepo;
    private final SocietyRepository societyRepo;

    public EventService(SocietyEventRepository eventRepo,
                        EventCalendarRepository calendarRepo,
                        SocietyRepository societyRepo) {
        this.eventRepo = eventRepo;
        this.calendarRepo = calendarRepo;
        this.societyRepo = societyRepo;
    }

    // CREATE NEW EVENT (accepts imageUrl if provided)
    public EventModel createEvent(EventModel event) {
        // Set initial status
        event.setStatus(EventStatus.PENDING);

        // imageUrl is already set in the controller if uploaded
        // paymentDone defaults to false (handled in EventModel)
        return eventRepo.save(event);
    }

    // GET EVENTS OF A SPECIFIC SOCIETY
    public List<EventModel> getSocietyEvents(Long societyId) {
        return eventRepo.findBySocietyId(societyId);
    }

    // GET ALL PENDING EVENTS (for admin)
    public List<EventModel> getPendingEvents() {
        return eventRepo.findByStatus(EventStatus.PENDING);
    }

    // GET ALL EVENTS (admin table)
    public List<EventModel> getAllEvents() {
        return eventRepo.findAll();
    }

    // GET SINGLE EVENT BY ID
    public EventModel getEvent(Long id) {
        return eventRepo.findById(id)
                .orElseThrow(() -> new EventNotFoundException(id));
    }

    // APPROVE EVENT (direct CONFIRMED)
    public EventModel approveEvent(Long id) {
        EventModel event = getEvent(id);

        // Check slot availability
        boolean busy = calendarRepo.existsByEventDateAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                event.getEventDate(),
                event.getStartTime(),
                event.getEndTime()
        );

        if (busy) {
            throw new SlotUnavailableException();
        }

        // Update status directly to CONFIRMED
        event.setStatus(EventStatus.CONFIRMED);
        event.setAdminMessage("Event Scheduled Successfully");

        EventModel updatedEvent = eventRepo.save(event);

        // Save to calendar
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

    // REJECT EVENT
    public EventModel rejectEvent(Long id, String message) {
        EventModel event = getEvent(id);
        event.setStatus(EventStatus.REJECTED);
        event.setAdminMessage(message);
        return eventRepo.save(event);
    }

    // DELETE EVENT
    @Transactional
    public void deleteEvent(Long id) {
        EventModel event = getEvent(id);
        calendarRepo.deleteByEventId(id);
        eventRepo.delete(event);
    }

    // ============ PUBLIC EVENTS FOR HOME PAGE ============

    // Get upcoming confirmed events (event date >= today)
    public List<EventDTO> getUpcomingEvents() {
        LocalDate today = LocalDate.now();
        List<EventModel> events = eventRepo.findByStatusAndEventDateGreaterThanEqualOrderByEventDateAsc(
                EventStatus.CONFIRMED, today);
        return events.stream()
                .map(this::toEventDTO)
                .collect(Collectors.toList());
    }

    // Get past confirmed events (event date < today)
    public List<EventDTO> getPastEvents() {
        LocalDate today = LocalDate.now();
        List<EventModel> events = eventRepo.findByStatusAndEventDateLessThanOrderByEventDateDesc(
                EventStatus.CONFIRMED, today);
        return events.stream()
                .map(this::toEventDTO)
                .collect(Collectors.toList());
    }

    // Get single event with society details (for event detail page)
    public EventDTO getEventWithSociety(Long id) {
        EventModel event = getEvent(id);
        return toEventDTO(event);
    }

    // Get confirmed events for a specific society (for society profile)
    public List<EventDTO> getConfirmedEventsBySociety(Long societyId) {
        List<EventModel> events = eventRepo.findBySocietyIdAndStatus(societyId, EventStatus.CONFIRMED);
        return events.stream()
                .map(this::toEventDTO)
                .collect(Collectors.toList());
    }

    // Helper: Convert EventModel to EventDTO with society name
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