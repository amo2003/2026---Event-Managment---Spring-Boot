package backend.model;

import backend.enums.EventStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class EventModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long societyId;

    private String eventName;
    private String description;
    private String venue;

    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    private EventStatus status;

    private String adminMessage;

    // NEW FIELD: track if payment is done
    @Column(nullable = false)
    private Boolean paymentDone = false; // default to false

    // Default constructor
    public EventModel() {}

    // Full constructor
    public EventModel(Long id, Long societyId, String eventName, String description, String venue,
                      LocalDate eventDate, LocalTime startTime, LocalTime endTime,
                      EventStatus status, String adminMessage, Boolean paymentDone) {
        this.id = id;
        this.societyId = societyId;
        this.eventName = eventName;
        this.description = description;
        this.venue = venue;
        this.eventDate = eventDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.adminMessage = adminMessage;
        this.paymentDone = paymentDone != null ? paymentDone : false; // ensure default
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSocietyId() { return societyId; }
    public void setSocietyId(Long societyId) { this.societyId = societyId; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }

    public String getAdminMessage() { return adminMessage; }
    public void setAdminMessage(String adminMessage) { this.adminMessage = adminMessage; }

    public Boolean getPaymentDone() { return paymentDone; }
    public void setPaymentDone(Boolean paymentDone) { this.paymentDone = paymentDone; }
}
