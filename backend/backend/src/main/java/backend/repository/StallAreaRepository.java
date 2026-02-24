package backend.repository;

import backend.model.StallModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StallAreaRepository extends JpaRepository<StallModel, Long> {
    List<StallModel> findByEventId(Long eventId);
}