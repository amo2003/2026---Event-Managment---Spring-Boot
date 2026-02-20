package backend.repository;

import backend.model.EventCalender;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;

public interface EventCalendarRepository extends JpaRepository<EventCalender, Long> {


    boolean existsByEventDateAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            LocalDate date,
            LocalTime startTime,
            LocalTime endTime
    );
}
