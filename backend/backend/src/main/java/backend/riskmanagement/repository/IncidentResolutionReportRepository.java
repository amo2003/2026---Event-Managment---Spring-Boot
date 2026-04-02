package backend.riskmanagement.repository;


import backend.riskmanagement.entity.IncidentResolutionReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IncidentResolutionReportRepository extends JpaRepository<IncidentResolutionReport, Long> {

    Optional<IncidentResolutionReport> findByIncidentId(Long incidentId);
}