package backend.riskmanagement.repository;

import backend.riskmanagement.entity.IncidentProof;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncidentProofRepository extends JpaRepository<IncidentProof, Long> {
}