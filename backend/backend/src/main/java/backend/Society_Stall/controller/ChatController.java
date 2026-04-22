package backend.Society_Stall.controller;

import backend.Society_Stall.model.ChatMessage;
import backend.Society_Stall.repository.ChatMessageRepository;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    @GetMapping("/api/chat/{eventId}")
    public List<ChatMessage> getHistory(@PathVariable Long eventId) {
        return chatRepo.findByEventIdOrderBySentAtAsc(eventId);
    }

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

    @PutMapping("/api/chat/{eventId}/mark-read")
    public void markRead(@PathVariable Long eventId, @RequestParam String viewerType) {
        if ("ADMIN".equals(viewerType)) {
            chatRepo.markAllReadByAdmin(eventId);
        } else {
            chatRepo.markAllReadBySociety(eventId);
        }
    }

    // Clear all messages for an event (both sides can clear)
    @DeleteMapping("/api/chat/{eventId}/clear")
    public void clearChat(@PathVariable Long eventId) {
        List<ChatMessage> msgs = chatRepo.findByEventIdOrderBySentAtAsc(eventId);
        chatRepo.deleteAll(msgs);
    }

    // Upload image attachment for chat
    @PostMapping("/api/chat/upload-image")
    public Map<String, String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String uploadDir = "uploads/chat/";
            Files.createDirectories(Paths.get(uploadDir));
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, filename);
            Files.write(filePath, file.getBytes());
            return Map.of("imageUrl", filename);
        } catch (Exception e) {
            throw new RuntimeException("Image upload failed: " + e.getMessage());
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
