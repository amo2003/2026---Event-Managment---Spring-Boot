package backend.repository;

import backend.model.EventModel;
import backend.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SocietyEventRepository extends JpaRepository<EventModel, Long> {

    List<EventModel> findBySocietyId(Long societyId);

    List<EventModel> findByStatus(EventStatus status);
}
