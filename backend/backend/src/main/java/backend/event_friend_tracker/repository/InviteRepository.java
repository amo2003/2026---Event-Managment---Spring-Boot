package backend.event_friend_tracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.event_friend_tracker.model.Invite;

public interface InviteRepository extends JpaRepository<Invite, Long> {
    
    List<Invite> findByInvitedUserId(Long userId);
}
