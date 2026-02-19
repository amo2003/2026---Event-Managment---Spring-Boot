package backend.controller;

import backend.model.EventCalender;
import backend.repository.EventCalendarRepository;
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
