package backend.Society_Stall.repository;

import backend.Society_Stall.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByEventIdOrderBySentAtAsc(Long eventId);

    // Count messages sent by ADMIN that society hasn't read yet
    long countByEventIdAndSenderTypeAndReadBySocietyFalse(Long eventId, String senderType);

    // Count messages sent by SOCIETY that admin hasn't read yet
    long countByEventIdAndSenderTypeAndReadByAdminFalse(Long eventId, String senderType);

    // Mark all messages in an event as read by admin
    @Modifying
    @Transactional
    @Query("UPDATE ChatMessage m SET m.readByAdmin = true WHERE m.eventId = :eventId")
    void markAllReadByAdmin(Long eventId);

    // Mark all messages in an event as read by society
    @Modifying
    @Transactional
    @Query("UPDATE ChatMessage m SET m.readBySociety = true WHERE m.eventId = :eventId")
    void markAllReadBySociety(Long eventId);
}
