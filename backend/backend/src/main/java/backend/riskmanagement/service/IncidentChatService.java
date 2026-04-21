package backend.riskmanagement.service;

import backend.riskmanagement.dto.ChatMessageRequest;
import backend.riskmanagement.dto.ChatMessageResponse;
import backend.riskmanagement.entity.AppUser;
import backend.riskmanagement.entity.Incident;
import backend.riskmanagement.entity.IncidentChatMessage;
import backend.riskmanagement.entity.Officer;
import backend.riskmanagement.enums.ChatSenderType;
import backend.riskmanagement.repository.AppUserRepository;
import backend.riskmanagement.repository.IncidentChatMessageRepository;
import backend.riskmanagement.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidentChatService {

    private final IncidentRepository incidentRepository;
    private final IncidentChatMessageRepository chatMessageRepository;
    private final AppUserRepository appUserRepository;

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getPublicMessages(String trackingCode) {
        Incident incident = getIncidentByTrackingCode(trackingCode);

        return chatMessageRepository
                .findByIncidentIdOrderByCreatedAtAsc(incident.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ChatMessageResponse sendPublicMessage(String trackingCode, ChatMessageRequest request) {
        Incident incident = getIncidentByTrackingCode(trackingCode);

        IncidentChatMessage chatMessage = new IncidentChatMessage();
        chatMessage.setIncident(incident);
        chatMessage.setSenderType(ChatSenderType.REPORTER);
        chatMessage.setSenderName(resolveReporterName(request.getSenderName(), incident));
        chatMessage.setMessage(request.getMessage().trim());

        IncidentChatMessage saved = chatMessageRepository.save(chatMessage);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getOfficerMessages(Long incidentId, String officerEmail) {
        Incident incident = getIncidentForAssignedOfficer(incidentId, officerEmail);

        return chatMessageRepository
                .findByIncidentIdOrderByCreatedAtAsc(incident.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ChatMessageResponse sendOfficerMessage(
            Long incidentId,
            String officerEmail,
            ChatMessageRequest request
    ) {
        Incident incident = getIncidentForAssignedOfficer(incidentId, officerEmail);

        AppUser officerUser = appUserRepository.findByEmail(officerEmail)
                .orElseThrow(() -> new RuntimeException("Officer account not found"));

        IncidentChatMessage chatMessage = new IncidentChatMessage();
        chatMessage.setIncident(incident);
        chatMessage.setSenderType(ChatSenderType.OFFICER);
        chatMessage.setSenderName(officerUser.getFullName());
        chatMessage.setMessage(request.getMessage().trim());

        IncidentChatMessage saved = chatMessageRepository.save(chatMessage);
        return mapToResponse(saved);
    }

    private Incident getIncidentByTrackingCode(String trackingCode) {
        return incidentRepository.findByTrackingCode(trackingCode.trim().toUpperCase())
                .orElseThrow(() -> new RuntimeException("Invalid tracking code"));
    }

    private Incident getIncidentForAssignedOfficer(Long incidentId, String officerEmail) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        Officer assignedOfficer = incident.getAssignedOfficer();

        if (assignedOfficer == null) {
            throw new RuntimeException("This incident is not assigned to an officer yet");
        }

        if (!assignedOfficer.getEmail().equalsIgnoreCase(officerEmail)) {
            throw new RuntimeException("Only the assigned officer can access this incident chat");
        }

        return incident;
    }

    private String resolveReporterName(String requestName, Incident incident) {
        if (requestName != null && !requestName.trim().isBlank()) {
            return requestName.trim();
        }

        if (incident.getReportedBy() != null && !incident.getReportedBy().trim().isBlank()) {
            return incident.getReportedBy().trim();
        }

        return "Reporter";
    }

    private ChatMessageResponse mapToResponse(IncidentChatMessage message) {
        ChatMessageResponse response = new ChatMessageResponse();
        response.setId(message.getId());
        response.setIncidentId(message.getIncident().getId());
        response.setSenderType(message.getSenderType());
        response.setSenderName(message.getSenderName());
        response.setMessage(message.getMessage());
        response.setCreatedAt(message.getCreatedAt());
        return response;
    }
}