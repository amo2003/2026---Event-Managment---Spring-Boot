package backend.event_friend_tracker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.event_friend_tracker.model.Group;
import backend.event_friend_tracker.model.GroupMember;
import backend.event_friend_tracker.service.GroupService;

@RestController
@RequestMapping("/api/groups")
public class GroupController {
    
    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping
    public Group createGroup(@RequestBody Group group) {
        return groupService.createGroup(group);
    }

    @GetMapping("/{groupId}/members")
    public List<GroupMember> getMembers(@PathVariable Long groupId) {
        return groupService.getGroupMembers(groupId);
    }

    @GetMapping("/{groupId}")
    public Group getGroupById(@PathVariable Long groupId) {
        return groupService.getGroupById(groupId);
    }
}