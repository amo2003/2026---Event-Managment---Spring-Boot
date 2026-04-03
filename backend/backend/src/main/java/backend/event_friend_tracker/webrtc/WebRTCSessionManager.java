package backend.event_friend_tracker.webrtc;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class WebRTCSessionManager {

    // groupId -> (userId -> session)
    private final Map<Long, Map<Long, WebSocketSession>> groupSessions = new ConcurrentHashMap<>();

    // sessionId -> userId
    private final Map<String, Long> sessionUserMap = new ConcurrentHashMap<>();

    // sessionId -> groupId
    private final Map<String, Long> sessionGroupMap = new ConcurrentHashMap<>();

    public void registerUser(Long groupId, Long userId, WebSocketSession session) {
        groupSessions
            .computeIfAbsent(groupId, g -> new ConcurrentHashMap<>())
            .put(userId, session);

        sessionUserMap.put(session.getId(), userId);
        sessionGroupMap.put(session.getId(), groupId);
    }

    public WebSocketSession getUserSession(Long groupId, Long userId) {
        Map<Long, WebSocketSession> members = groupSessions.get(groupId);
        if (members == null) return null;
        return members.get(userId);
    }

    public Set<Long> getOnlineUsersInGroup(Long groupId) {
        Map<Long, WebSocketSession> members = groupSessions.get(groupId);
        if (members == null) return Set.of();
        return members.keySet();
    }

    public Long getUserIdBySession(WebSocketSession session) {
        return sessionUserMap.get(session.getId());
    }

    public Long getGroupIdBySession(WebSocketSession session) {
        return sessionGroupMap.get(session.getId());
    }

    public void removeSession(WebSocketSession session) {
        Long userId = sessionUserMap.remove(session.getId());
        Long groupId = sessionGroupMap.remove(session.getId());

        if (userId == null || groupId == null) return;

        Map<Long, WebSocketSession> members = groupSessions.get(groupId);
        if (members != null) {
            members.remove(userId);

            if (members.isEmpty()) {
                groupSessions.remove(groupId);
            }
        }
    }
}