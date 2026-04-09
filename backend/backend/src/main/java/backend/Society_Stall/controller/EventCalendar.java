package backend.Society_Stall.controller;

import backend.Society_Stall.model.EventCalender;
import backend.Society_Stall.repository.EventCalendarRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin("http://localhost:3000")
public class EventCalendar {

    private final EventCalendarRepository calendarRepo;

    public EventCalendar(EventCalendarRepository calendarRepo) {
        this.calendarRepo = calendarRepo;
    }

    @GetMapping("/all")
    public List<EventCalender> getAllEvents() {
        return calendarRepo.findAll();
    }
}
