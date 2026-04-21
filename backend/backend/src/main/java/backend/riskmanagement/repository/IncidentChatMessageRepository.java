package backend.riskmanagement.repository;

import backend.riskmanagement.entity.IncidentChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentChatMessageRepository extends JpaRepository<IncidentChatMessage, Long> {

    List<IncidentChatMessage> findByIncidentIdOrderByCreatedAtAsc(Long incidentId);
}