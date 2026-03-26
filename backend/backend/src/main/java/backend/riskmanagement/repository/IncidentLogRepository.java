package backend.riskmanagement.repository;

import backend.riskmanagement.entity.IncidentLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncidentLogRepository extends JpaRepository<IncidentLog, Long> {
}
