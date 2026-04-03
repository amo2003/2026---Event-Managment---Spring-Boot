package backend.riskmanagement.repository;


import backend.riskmanagement.entity.IncidentLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentLogRepository extends JpaRepository<IncidentLog, Long> {
    List<IncidentLog> findByIncidentIdOrderByCreatedAtAsc(Long incidentId);
}