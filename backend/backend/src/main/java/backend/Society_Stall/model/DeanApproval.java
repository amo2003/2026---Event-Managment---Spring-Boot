package backend.Society_Stall.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dean_approvals")
public class DeanApproval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    private Long eventId;
    private String eventName;
    private String societyName;
    private String facultyName;
    private String deanName;
    private String deanEmail;

    @Enumerated(EnumType.STRING)
    private DeanResponse response; // PENDING, APPROVED, REJECTED

    @Column(columnDefinition = "TEXT")
    private String deanComment;

    private LocalDateTime sentAt;
    private LocalDateTime respondedAt;

    public enum DeanResponse { PENDING, APPROVED, REJECTED }

    public DeanApproval() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public String getSocietyName() { return societyName; }
    public void setSocietyName(String societyName) { this.societyName = societyName; }

    public String getFacultyName() { return facultyName; }
    public void setFacultyName(String facultyName) { this.facultyName = facultyName; }

    public String getDeanName() { return deanName; }
    public void setDeanName(String deanName) { this.deanName = deanName; }

    public String getDeanEmail() { return deanEmail; }
    public void setDeanEmail(String deanEmail) { this.deanEmail = deanEmail; }

    public DeanResponse getResponse() { return response; }
    public void setResponse(DeanResponse response) { this.response = response; }

    public String getDeanComment() { return deanComment; }
    public void setDeanComment(String deanComment) { this.deanComment = deanComment; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

    public LocalDateTime getRespondedAt() { return respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }
}
