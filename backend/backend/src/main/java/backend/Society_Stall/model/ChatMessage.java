package backend.Society_Stall.Service.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which event this chat belongs to
    private Long eventId;

    // "ADMIN" or "SOCIETY"
    private String senderType;

    private String senderName;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime sentAt;

    // false = unread by the other side
    private boolean readByAdmin = false;
    private boolean readBySociety = false;

    @PrePersist
    public void prePersist() {
        if (sentAt == null) sentAt = LocalDateTime.now();
    }

    public ChatMessage() {}

    public ChatMessage(Long eventId, String senderType, String senderName, String content) {
        this.eventId = eventId;
        this.senderType = senderType;
        this.senderName = senderName;
        this.content = content;
        // sender has already "read" their own message
        this.readByAdmin   = "ADMIN".equals(senderType);
        this.readBySociety = "SOCIETY".equals(senderType);
    }

    public Long getId() { return id; }
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    public String getSenderType() { return senderType; }
    public void setSenderType(String senderType) { this.senderType = senderType; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
    public boolean isReadByAdmin() { return readByAdmin; }
    public void setReadByAdmin(boolean readByAdmin) { this.readByAdmin = readByAdmin; }
    public boolean isReadBySociety() { return readBySociety; }
    public void setReadBySociety(boolean readBySociety) { this.readBySociety = readBySociety; }
}
