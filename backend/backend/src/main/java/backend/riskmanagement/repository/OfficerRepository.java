package backend.riskmanagement.repository;


import backend.riskmanagement.entity.Officer;
import backend.riskmanagement.enums.OfficerRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OfficerRepository extends JpaRepository<Officer, Long> {

    boolean existsByEmail(String email);

    Optional<Officer> findByEmail(String email);

    List<Officer> findByIsAvailableTrueOrderByActiveIncidentCountAsc();

    List<Officer> findByIsAvailableTrueAndRoleOrderByActiveIncidentCountAsc(OfficerRole role);
}