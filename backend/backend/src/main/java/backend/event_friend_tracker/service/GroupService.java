package backend.event_friend_tracker.service;

import java.time.LocalDateTime;
import java.util.List;

import backend.event_friend_tracker.model.Group;
import backend.event_friend_tracker.model.GroupMember;
import backend.event_friend_tracker.repository.GroupMemberRepository;
import backend.event_friend_tracker.repository.GroupRepository;
import org.springframework.stereotype.Service;

@Service
public class GroupService {
    
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;

    public GroupService(GroupRepository groupRepository, GroupMemberRepository groupMemberRepository) {
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
    }

    public Group createGroup(Group group) {
        if (group.getName() == null || group.getName().trim().isEmpty()) {
            throw new RuntimeException("Group name is required");
        }

        if (group.getCreatedBy() == null) {
            throw new RuntimeException("Admin user ID is required");
        }

        if (group.getAdminName() == null || group.getAdminName().trim().isEmpty()) {
            throw new RuntimeException("Admin name is required");
        }

        if (group.getEventRadius() == null || group.getEventRadius() <= 0) {
            throw new RuntimeException("Valid event radius is required");
        }

        group.setCreatedAt(LocalDateTime.now());

        Group savedGroup = groupRepository.save(group);

        GroupMember adminMember = new GroupMember();
        adminMember.setGroupId(savedGroup.getId());
        adminMember.setUserId(savedGroup.getCreatedBy());
        adminMember.setUserName(savedGroup.getAdminName());
        adminMember.setRole("ADMIN");

        groupMemberRepository.save(adminMember);

        return savedGroup;
    }

    public List<GroupMember> getGroupMembers(Long groupId) {
        return groupMemberRepository.findByGroupId(groupId);
    }

    public Group getGroupById(Long groupId) {
        return groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));
    }
}