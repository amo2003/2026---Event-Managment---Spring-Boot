package backend.riskmanagement.repository;



import backend.riskmanagement.entity.IncidentProof;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentProofRepository extends JpaRepository<IncidentProof, Long> {

    List<IncidentProof> findByIncidentIdOrderByCreatedAtDesc(Long incidentId);
}