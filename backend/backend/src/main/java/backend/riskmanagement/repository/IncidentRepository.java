package backend.riskmanagement.repository;


import backend.riskmanagement.entity.Incident;
import backend.riskmanagement.enums.IncidentPriority;
import backend.riskmanagement.enums.IncidentStatus;
import backend.riskmanagement.enums.IncidentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IncidentRepository extends JpaRepository<Incident, Long> {

    Optional<Incident> findByTrackingCode(String trackingCode);

    long countByStatus(IncidentStatus status);

    long countByPriority(IncidentPriority priority);

    @Query("""
            select i from Incident i
            where (:status is null or i.status = :status)
              and (:priority is null or i.priority = :priority)
              and (:incidentType is null or i.incidentType = :incidentType)
              and (:placeAreaId is null or i.placeArea.id = :placeAreaId)
              and (:reportedBy is null or lower(i.reportedBy) like lower(concat('%', :reportedBy, '%')))
            order by i.createdAt desc
            """)
    List<Incident> filterIncidents(IncidentStatus status,
                                   IncidentPriority priority,
                                   IncidentType incidentType,
                                   Long placeAreaId,
                                   String reportedBy);
}