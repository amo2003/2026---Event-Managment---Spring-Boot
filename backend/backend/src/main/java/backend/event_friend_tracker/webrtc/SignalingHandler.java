package backend.event_friend_tracker.webrtc;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Set;

@Component
public class SignalingHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final WebRTCSessionManager sessionManager;

    public SignalingHandler(WebRTCSessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        System.out.println("WebSocket connected: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        SignalingMessage signalingMessage =
                objectMapper.readValue(message.getPayload(), SignalingMessage.class);

        if ("join".equals(signalingMessage.getType())) {
            handleJoin(session, signalingMessage);
            return;
        }

        if (signalingMessage.getGroupId() == null ||
            signalingMessage.getFromUserId() == null ||
            signalingMessage.getToUserId() == null) {
            System.out.println("Invalid signaling message: missing groupId/fromUserId/toUserId");
            return;
        }

        WebSocketSession targetSession = sessionManager.getUserSession(
                signalingMessage.getGroupId(),
                signalingMessage.getToUserId()
        );

        if (targetSession != null && targetSession.isOpen()) {
            String json = objectMapper.writeValueAsString(signalingMessage);
            targetSession.sendMessage(new TextMessage(json));
        } else {
            System.out.println("Target user not connected: " + signalingMessage.getToUserId());
        }
    }

    private void handleJoin(WebSocketSession session, SignalingMessage message) throws Exception {
        if (message.getGroupId() == null || message.getFromUserId() == null) {
            System.out.println("Join message missing groupId or fromUserId");
            return;
        }

        Long groupId = message.getGroupId();
        Long joinedUserId = message.getFromUserId();

        sessionManager.registerUser(groupId, joinedUserId, session);

        Set<Long> onlineUsers = sessionManager.getOnlineUsersInGroup(groupId);

        // 1. Send current online users to the newly joined user
        SignalingMessage onlineUsersMessage = new SignalingMessage();
        onlineUsersMessage.setType("online-users");
        onlineUsersMessage.setGroupId(groupId);
        onlineUsersMessage.setFromUserId(null);
        onlineUsersMessage.setToUserId(joinedUserId);
        onlineUsersMessage.setData(onlineUsers);

        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(onlineUsersMessage)));

        // 2. Notify all existing users that a new user joined
        for (Long existingUserId : onlineUsers) {
            if (existingUserId.equals(joinedUserId)) {
                continue;
            }

            WebSocketSession existingSession = sessionManager.getUserSession(groupId, existingUserId);

            if (existingSession != null && existingSession.isOpen()) {
                SignalingMessage notifyExistingUser = new SignalingMessage();
                notifyExistingUser.setType("online-users");
                notifyExistingUser.setGroupId(groupId);
                notifyExistingUser.setFromUserId(null);
                notifyExistingUser.setToUserId(existingUserId);
                notifyExistingUser.setData(onlineUsers);

                existingSession.sendMessage(
                        new TextMessage(objectMapper.writeValueAsString(notifyExistingUser))
                );
            }
        }

        System.out.println("User joined group " + groupId + ": " + joinedUserId);
        System.out.println("Online users in group " + groupId + ": " + onlineUsers);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        Long userId = sessionManager.getUserIdBySession(session);
        Long groupId = sessionManager.getGroupIdBySession(session);

        sessionManager.removeSession(session);

        System.out.println("WebSocket disconnected: " + session.getId());

        // Optional: notify remaining users after someone leaves
        if (groupId != null) {
            Set<Long> remainingUsers = sessionManager.getOnlineUsersInGroup(groupId);

            for (Long remainingUserId : remainingUsers) {
                WebSocketSession remainingSession = sessionManager.getUserSession(groupId, remainingUserId);

                if (remainingSession != null && remainingSession.isOpen()) {
                    try {
                        SignalingMessage updateMessage = new SignalingMessage();
                        updateMessage.setType("online-users");
                        updateMessage.setGroupId(groupId);
                        updateMessage.setFromUserId(userId);
                        updateMessage.setToUserId(remainingUserId);
                        updateMessage.setData(remainingUsers);

                        remainingSession.sendMessage(
                                new TextMessage(objectMapper.writeValueAsString(updateMessage))
                        );
                    } catch (Exception e) {
                        System.out.println("Failed to notify remaining user: " + remainingUserId);
                    }
                }
            }
        }
    }
}