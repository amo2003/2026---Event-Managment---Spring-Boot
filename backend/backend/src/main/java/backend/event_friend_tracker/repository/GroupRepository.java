package backend.event_friend_tracker.repository;

import backend.event_friend_tracker.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<Group, Long>{
    
}
