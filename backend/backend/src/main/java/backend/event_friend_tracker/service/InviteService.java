package backend.event_friend_tracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import backend.event_friend_tracker.model.GroupMember;
import backend.event_friend_tracker.model.Invite;
import backend.event_friend_tracker.repository.GroupMemberRepository;
import backend.event_friend_tracker.repository.InviteRepository;

@Service
public class InviteService {
    
    private final InviteRepository inviteRepository;
    private final GroupMemberRepository groupMemberRepository;

    public InviteService(InviteRepository inviteRepository, GroupMemberRepository groupMemberRepository) {
        this.inviteRepository = inviteRepository;
        this.groupMemberRepository = groupMemberRepository;
    }

    public Invite sendInvite(Invite invite) {
        if (invite.getGroupId() == null) {
            throw new RuntimeException("Group ID is required");
        }

        if (invite.getInvitedUserId() == null) {
            throw new RuntimeException("Friend user ID is required");
        }

        if (invite.getInvitedUserName() == null || invite.getInvitedUserName().trim().isEmpty()) {
            throw new RuntimeException("Friend user name is required");
        }

        invite.setStatus("PENDING");
        return inviteRepository.save(invite);
    }
    
    public Invite acceptInvite(Long inviteId) {
        Invite invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        invite.setStatus("ACCEPTED");
        inviteRepository.save(invite);

        GroupMember member = new GroupMember();
        member.setGroupId(invite.getGroupId());
        member.setUserId(invite.getInvitedUserId());
        member.setUserName(invite.getInvitedUserName());
        member.setRole("MEMBER");

        groupMemberRepository.save(member);

        return invite;
    }

    public Invite rejectInvite(Long inviteId) {
    Invite invite = inviteRepository.findById(inviteId)
            .orElseThrow(() -> new RuntimeException("Invite not found"));

    invite.setStatus("REJECTED");

    return inviteRepository.save(invite);
}

    public List<Invite> getPendingRequestsByGroup(Long groupId) {
        return inviteRepository.findByGroupIdAndStatus(groupId, "PENDING");
    }
}