package backend.dto;

import backend.enums.EventStatus;
import backend.model.EventModel;

import java.time.LocalDate;
import java.time.LocalTime;

public class EventDTO {

    private Long id;
    private Long societyId;
    private String societyName;
    private String eventName;
    private String contactNumber;
    private String description;
    private String venue;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private EventStatus status;
    private String adminMessage;
    private Boolean paymentDone;
    private String imageUrl;

    // Default constructor
    public EventDTO() {}

    // Constructor from EventModel + societyName
    public EventDTO(EventModel event, String societyName) {
        this.id = event.getId();
        this.societyId = event.getSocietyId();
        this.societyName = societyName;
        this.eventName = event.getEventName();
        this.description = event.getDescription();
        this.venue = event.getVenue();
        this.contactNumber = event.getContactNumber();
        this.eventDate = event.getEventDate();
        this.startTime = event.getStartTime();
        this.endTime = event.getEndTime();
        this.status = event.getStatus();
        this.adminMessage = event.getAdminMessage();
        this.paymentDone = event.getPaymentDone();
        this.imageUrl = event.getImageUrl();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSocietyId() { return societyId; }
    public void setSocietyId(Long societyId) { this.societyId = societyId; }

    public String getSocietyName() { return societyName; }
    public void setSocietyName(String societyName) { this.societyName = societyName; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

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

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
