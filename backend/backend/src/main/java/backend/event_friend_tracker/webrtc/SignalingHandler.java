package backend.event_friend_tracker.webrtc;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class SignalingHandler extends TextWebSocketHandler {

    private final Map<String, WebSocketSession> users = new HashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {

        users.put(session.getId(), session);

    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        String payload = message.getPayload();

        for (WebSocketSession user : users.values()) {

            if (user.isOpen()) {

                user.sendMessage(new TextMessage(payload));

            }

        }

    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {

        users.remove(session.getId());

    }
    
}
