package backend.event_friend_tracker.repository;

import backend.event_friend_tracker.model.Invite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InviteRepository extends JpaRepository<Invite, Long> {

    List<Invite> findByInvitedUserId(Long userId);

    List<Invite> findByGroupIdAndStatus(Long groupId, String status);
}