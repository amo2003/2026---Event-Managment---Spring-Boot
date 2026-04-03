package backend.event_friend_tracker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import backend.event_friend_tracker.model.Invite;
import backend.event_friend_tracker.service.InviteService;

@RestController
@RequestMapping("/api/invites")
public class InviteController {

    private final InviteService inviteService;

    public InviteController(InviteService inviteService) {
        this.inviteService = inviteService;
    }

    @PostMapping
    public Invite sendInvite(@RequestBody Invite invite) {
        return inviteService.sendInvite(invite);
    }

    @PutMapping("/{inviteId}/accept")
    public Invite acceptInvite(@PathVariable Long inviteId) {
        return inviteService.acceptInvite(inviteId);
    }

    @GetMapping("/group/{groupId}")
    public List<Invite> getPendingRequestsByGroup(@PathVariable Long groupId) {
        return inviteService.getPendingRequestsByGroup(groupId);
    }

    @PutMapping("/{id}/reject")
    public Invite rejectInvite(@PathVariable Long id) {
        return inviteService.rejectInvite(id);
}
}