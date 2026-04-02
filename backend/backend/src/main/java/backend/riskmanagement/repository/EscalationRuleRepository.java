package backend.riskmanagement.repository;


import backend.riskmanagement.entity.EscalationRule;
import backend.riskmanagement.enums.IncidentPriority;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EscalationRuleRepository extends JpaRepository<EscalationRule, Long> {
    Optional<EscalationRule> findByPriorityAndIsActiveTrue(IncidentPriority priority);
}