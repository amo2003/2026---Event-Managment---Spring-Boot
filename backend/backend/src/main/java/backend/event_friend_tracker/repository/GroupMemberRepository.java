package backend.event_friend_tracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.event_friend_tracker.model.GroupMember;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    List<GroupMember> findByGroupId(Long groupId);
}
