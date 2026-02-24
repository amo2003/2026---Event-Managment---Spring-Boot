package backend.controller;

import backend.Service.EventService;
import backend.enums.EventStatus;
import backend.model.EventModel;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/society/events")
@CrossOrigin
public class Event {

    private final EventService eventService;

    public Event(EventService eventService) {
        this.eventService = eventService;
    }

    // Single method for JSON or form-data with file
    @PostMapping("/create")
    public EventModel create(
            @ModelAttribute EventModel event,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        if (image != null && !image.isEmpty()) {
            try {
                String uploadDir = "uploads/events/";
                Files.createDirectories(Paths.get(uploadDir));

                String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, filename);
                Files.write(filePath, image.getBytes());

                event.setImageUrl(filename);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        event.setStatus(EventStatus.PENDING);
        return eventService.createEvent(event);
    }

    @GetMapping("/my/{societyId}")
    public List<EventModel> myEvents(@PathVariable Long societyId) {
        return eventService.getSocietyEvents(societyId);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return "Event deleted successfully";
    }



}