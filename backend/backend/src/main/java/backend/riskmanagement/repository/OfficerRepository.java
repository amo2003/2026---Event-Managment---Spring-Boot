package backend.riskmanagement.repository;

import backend.riskmanagement.entity.Officer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OfficerRepository extends JpaRepository<Officer, Long> {
    List<Officer> findByIsAvailableTrueOrderByActiveIncidentCountAsc();
    Optional<Officer> findByEmail(String email);
    boolean existsByEmail(String email);
}