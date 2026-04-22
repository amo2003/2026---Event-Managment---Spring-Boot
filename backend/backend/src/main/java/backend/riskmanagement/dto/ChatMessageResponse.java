package backend.riskmanagement.dto;

import backend.riskmanagement.enums.ChatSenderType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ChatMessageResponse {

    private Long id;
    private Long incidentId;
    private ChatSenderType senderType;
    private String senderName;
    private String message;
    private LocalDateTime createdAt;
}