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

    //constructor
    public GroupService(GroupRepository groupRepository, GroupMemberRepository groupMemberRepository){
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
    }

    public Group createGroup(Group group){

        group.setCreatedAt(LocalDateTime.now());

        return groupRepository.save(group);
    }

    public List<GroupMember> getGroupMembers(Long groupId){

        return groupMemberRepository.findByGroupId(groupId);

    }
}
