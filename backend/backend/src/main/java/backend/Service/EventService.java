package backend.Service;

import backend.enums.EventStatus;
import backend.exception.EventNotFoundException;
import backend.exception.SlotUnavailableException;
import backend.model.EventCalender;
import backend.model.EventModel;
import backend.model.EventPayment;
import backend.repository.EventCalendarRepository;
import backend.repository.EventPaymentRepository;
import backend.repository.SocietyEventRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    private final SocietyEventRepository eventRepo;
    private final EventCalendarRepository calendarRepo;
    private final EventPaymentRepository paymentRepo;

    public EventService(SocietyEventRepository eventRepo,
                        EventCalendarRepository calendarRepo,
                        EventPaymentRepository paymentRepo) {
        this.eventRepo = eventRepo;
        this.calendarRepo = calendarRepo;
        this.paymentRepo = paymentRepo;
    }

    // Create new event
    public EventModel createEvent(EventModel event) {
        event.setStatus(EventStatus.PENDING);
        return eventRepo.save(event);
    }

    // Get events of a specific society
    public List<EventModel> getSocietyEvents(Long societyId) {
        return eventRepo.findBySocietyId(societyId);
    }

    // Get all pending events (for admin)
    public List<EventModel> getPendingEvents() {
        return eventRepo.findByStatus(EventStatus.PENDING);
    }

    // Get single event by ID
    public EventModel getEvent(Long id) {
        return eventRepo.findById(id)
                .orElseThrow(() -> new EventNotFoundException(id));
    }

    // Approve event and save to calendar
    public EventModel approveEvent(Long id) {
        EventModel event = getEvent(id);

        // Check if the time slot is already booked
        boolean busy = calendarRepo.existsByEventDateAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                event.getEventDate(),
                event.getStartTime(),   // existing start <= new end
                event.getEndTime()      // existing end   >= new start
        );

        if (busy) {
            throw new SlotUnavailableException();
        }

        // Update event status
        event.setStatus(EventStatus.APPROVED_PAYMENT_PENDING);
        EventModel updatedEvent = eventRepo.save(event);

        // Add to calendar
        EventCalender cal = new EventCalender();
        cal.setEventId(updatedEvent.getId());
        cal.setEventDate(updatedEvent.getEventDate());
        cal.setStartTime(updatedEvent.getStartTime());
        cal.setEndTime(updatedEvent.getEndTime());
        cal.setVenue(updatedEvent.getVenue());
        cal.setEventName(updatedEvent.getEventName());
        calendarRepo.save(cal);

        return updatedEvent;
    }

    // Reject event with admin message
    public EventModel rejectEvent(Long id, String message) {
        EventModel event = getEvent(id);
        event.setStatus(EventStatus.REJECTED);
        event.setAdminMessage(message);
        return eventRepo.save(event);
    }

    // Complete payment for an event
    public EventModel completePayment(Long eventId, Double amount, String method) {
        // Save payment details
        EventPayment payment = new EventPayment();
        payment.setEventId(eventId);
        payment.setAmount(amount);
        payment.setPaymentMethod(method);
        payment.setPaidAt(LocalDateTime.now());
        paymentRepo.save(payment);

        // Update event status to CONFIRMED
        EventModel event = getEvent(eventId);
        event.setStatus(EventStatus.CONFIRMED);
        event.setPaymentDone(true);
        return eventRepo.save(event);
    }
}
