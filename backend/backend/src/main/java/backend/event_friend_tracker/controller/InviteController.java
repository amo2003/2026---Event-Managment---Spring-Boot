package backend.event_friend_tracker.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.event_friend_tracker.model.Invite;
import backend.event_friend_tracker.service.InviteService;

@RestController
@RequestMapping("/api/invites")
public class InviteController {
    
    private final InviteService inviteService;

    public InviteController(InviteService inviteService){
        this.inviteService = inviteService;
    }

    @PostMapping
    public Invite sendInvite(@RequestBody Invite invite){
        return inviteService.sendInvite(invite);
    }

    @PutMapping("/{inviteId}/accept")
        public Invite acceptInvite(@PathVariable Long inviteId){
        return inviteService.acceptInvite(inviteId);
    }
}
