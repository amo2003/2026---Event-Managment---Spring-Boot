package backend.Society_Stall.Service.repository;

import backend.Society_Stall.Service.model.EventCalender;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.time.LocalDate;
import java.time.LocalTime;

public interface EventCalendarRepository extends JpaRepository<EventCalender, Long> {


    boolean existsByEventDateAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            LocalDate date,
            LocalTime startTime,
            LocalTime endTime
    );

    @Modifying
    @Transactional
    void deleteByEventId(Long eventId);}
