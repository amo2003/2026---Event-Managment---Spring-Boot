package backend.riskmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageRequest {

    // Used only in public reporter side.
    // Officer side gets name from logged-in user.
    @Size(max = 80, message = "Sender name must be under 80 characters")
    private String senderName;

    @NotBlank(message = "Message is required")
    @Size(min = 1, max = 500, message = "Message must be between 1 and 500 characters")
    private String message;
}