package backend.riskmanagement.controller;

import backend.riskmanagement.dto.ChatMessageRequest;
import backend.riskmanagement.dto.ChatMessageResponse;
import backend.riskmanagement.service.IncidentChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class IncidentChatController {

    private final IncidentChatService incidentChatService;

    // Public reporter side: view messages using tracking code
    @GetMapping("/public/{trackingCode}")
    public List<ChatMessageResponse> getPublicMessages(@PathVariable String trackingCode) {
        return incidentChatService.getPublicMessages(trackingCode);
    }

    // Public reporter side: send message using tracking code
    @PostMapping("/public/{trackingCode}")
    public ChatMessageResponse sendPublicMessage(
            @PathVariable String trackingCode,
            @Valid @RequestBody ChatMessageRequest request
    ) {
        return incidentChatService.sendPublicMessage(trackingCode, request);
    }

    // Officer side: view messages for assigned incident
    @GetMapping("/officer/incidents/{incidentId}")
    public List<ChatMessageResponse> getOfficerMessages(
            @PathVariable Long incidentId,
            Authentication authentication
    ) {
        return incidentChatService.getOfficerMessages(
                incidentId,
                authentication.getName()
        );
    }

    // Officer side: reply to reporter
    @PostMapping("/officer/incidents/{incidentId}")
    public ChatMessageResponse sendOfficerMessage(
            @PathVariable Long incidentId,
            Authentication authentication,
            @Valid @RequestBody ChatMessageRequest request
    ) {
        return incidentChatService.sendOfficerMessage(
                incidentId,
                authentication.getName(),
                request
        );
    }
}