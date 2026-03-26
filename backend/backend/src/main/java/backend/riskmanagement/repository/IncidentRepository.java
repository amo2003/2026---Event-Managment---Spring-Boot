package backend.riskmanagement.repository;

import backend.riskmanagement.dto.PlaceIncidentCountResponse;
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

    List<Incident> findByStatus(IncidentStatus status);

    List<Incident> findByPriority(IncidentPriority priority);

    List<Incident> findByIncidentType(IncidentType incidentType);

    List<Incident> findByPlaceAreaId(Long placeAreaId);

    List<Incident> findByReportedByContainingIgnoreCase(String reportedBy);

    @Query("""
            SELECT new com.example.Risk_new.dto.PlaceIncidentCountResponse(
                i.placeArea.id,
                i.placeArea.name,
                COUNT(i)
            )
            FROM Incident i
            GROUP BY i.placeArea.id, i.placeArea.name
            """)
    List<PlaceIncidentCountResponse> countIncidentsGroupByPlace();
}
