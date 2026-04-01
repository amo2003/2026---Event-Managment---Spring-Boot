package backend.Society_Stall.Service.controller;

import backend.Society_Stall.Service.model.ChatMessage;
import backend.Society_Stall.Service.repository.ChatMessageRepository;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
public class ChatController {

    private final ChatMessageRepository chatRepo;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(ChatMessageRepository chatRepo,
                          SimpMessagingTemplate messagingTemplate) {
        this.chatRepo = chatRepo;
        this.messagingTemplate = messagingTemplate;
    }

    // Load chat history for an event
    @GetMapping("/api/chat/{eventId}")
    public List<ChatMessage> getHistory(@PathVariable Long eventId) {
        return chatRepo.findByEventIdOrderBySentAtAsc(eventId);
    }

    // Unread count for a specific viewer (ADMIN or SOCIETY)
    @GetMapping("/api/chat/{eventId}/unread")
    public Map<String, Long> getUnreadCount(
            @PathVariable Long eventId,
            @RequestParam String viewerType) {
        long count;
        if ("ADMIN".equals(viewerType)) {
            count = chatRepo.countByEventIdAndSenderTypeAndReadByAdminFalse(eventId, "SOCIETY");
        } else {
            count = chatRepo.countByEventIdAndSenderTypeAndReadBySocietyFalse(eventId, "ADMIN");
        }
        return Map.of("unread", count);
    }

    // Mark all messages as read when chat is opened
    @PutMapping("/api/chat/{eventId}/mark-read")
    public void markRead(@PathVariable Long eventId, @RequestParam String viewerType) {
        if ("ADMIN".equals(viewerType)) {
            chatRepo.markAllReadByAdmin(eventId);
        } else {
            chatRepo.markAllReadBySociety(eventId);
        }
    }

    // WebSocket: receive, save, broadcast
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage message) {
        ChatMessage saved = chatRepo.save(message);
        messagingTemplate.convertAndSend("/topic/chat/" + saved.getEventId(), saved);
        long adminUnread   = chatRepo.countByEventIdAndSenderTypeAndReadByAdminFalse(saved.getEventId(), "SOCIETY");
        long societyUnread = chatRepo.countByEventIdAndSenderTypeAndReadBySocietyFalse(saved.getEventId(), "ADMIN");
        java.util.Map<String, Long> unreadPayload = new java.util.HashMap<>();
        unreadPayload.put("adminUnread", adminUnread);
        unreadPayload.put("societyUnread", societyUnread);
        messagingTemplate.convertAndSend("/topic/unread/" + saved.getEventId(), (Object) unreadPayload);
    }
}
