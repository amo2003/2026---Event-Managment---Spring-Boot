package backend.event_friend_tracker.service;

import org.springframework.stereotype.Service;

import backend.event_friend_tracker.model.GroupMember;
import backend.event_friend_tracker.model.Invite;
import backend.event_friend_tracker.repository.GroupMemberRepository;
import backend.event_friend_tracker.repository.InviteRepository;

@Service
public class InviteService {
    
    private final InviteRepository inviteRepository;
    private final GroupMemberRepository groupMemberRepository;

    public InviteService(InviteRepository inviteRepository , GroupMemberRepository groupMemberRepository){
        this.inviteRepository = inviteRepository;
        this.groupMemberRepository = groupMemberRepository;
    }

    public Invite sendInvite(Invite invite){

        invite.setStatus("PENDING");

        return inviteRepository.save(invite);

    }
    
    public Invite acceptInvite(Long inviteId){

        Invite invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        invite.setStatus("ACCEPTED");

        inviteRepository.save(invite);

        GroupMember member = new GroupMember();

        member.setGroupId(invite.getGroupId());
        member.setUserId(invite.getInvitedUserId());
        member.setRole("MEMBER");

        groupMemberRepository.save(member);

        return invite;
    }

}
