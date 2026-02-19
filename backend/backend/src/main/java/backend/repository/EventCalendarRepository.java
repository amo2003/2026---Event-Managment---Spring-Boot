package backend.repository;

import backend.model.EventCalender;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;

public interface EventCalendarRepository extends JpaRepository<EventCalender, Long> {

    /**
     * Check if there is any event on the same date where
     * existingStartTime <= newEndTime AND existingEndTime >= newStartTime.
     *
     * NOTE: The parameter order MUST match the method name for Spring Data
     * to generate the correct query: (date, newEndTime, newStartTime)
     * where the second param maps to "StartTimeLessThanEqual" and the
     * third param maps to "EndTimeGreaterThanEqual".
     */
    boolean existsByEventDateAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            LocalDate date,
            LocalTime startTime,
            LocalTime endTime
    );
}
