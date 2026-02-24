package backend.repository;

import backend.model.EventModel;
import backend.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface SocietyEventRepository extends JpaRepository<EventModel, Long> {

    List<EventModel> findBySocietyId(Long societyId);

    List<EventModel> findByStatus(EventStatus status);

    // Find confirmed events where event date is today or in the future (upcoming)
    List<EventModel> findByStatusAndEventDateGreaterThanEqualOrderByEventDateAsc(EventStatus status, LocalDate date);

    // Find confirmed events where event date is in the past (past events)
    List<EventModel> findByStatusAndEventDateLessThanOrderByEventDateDesc(EventStatus status, LocalDate date);

    // Find confirmed events for a specific society
    List<EventModel> findBySocietyIdAndStatus(Long societyId, EventStatus status);
}
