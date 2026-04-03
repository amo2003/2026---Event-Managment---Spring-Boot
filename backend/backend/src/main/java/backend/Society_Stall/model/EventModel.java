package backend.Society_Stall.Service.model;

import backend.Society_Stall.Service.enums.EventStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "events")
public class EventModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long societyId;

    @Column(nullable = false)
    private String eventName;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String venue;

    @Column(name = "contact_number")
    private String contactNumber;

    private LocalDate eventDate;

    private LocalTime startTime;

    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    private EventStatus status;

    @Column(columnDefinition = "TEXT")
    private String adminMessage;

    @Column(nullable = false)
    private Boolean paymentDone = false;

    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String artists;

    public EventModel() {}

    public EventModel(Long societyId, String eventName, String description,
                      String venue, String contactNumber,
                      LocalDate eventDate, LocalTime startTime, LocalTime endTime,
                      EventStatus status, String adminMessage, Boolean paymentDone,
                      String imageUrl) {

        this.societyId = societyId;
        this.eventName = eventName;
        this.description = description;
        this.venue = venue;
        this.contactNumber = contactNumber;
        this.eventDate = eventDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.adminMessage = adminMessage;
        this.paymentDone = paymentDone != null ? paymentDone : false;
        this.imageUrl = imageUrl;
    }

    // Getters & Setters

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

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

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

    public String getArtists() { return artists; }
    public void setArtists(String artists) { this.artists = artists; }
}