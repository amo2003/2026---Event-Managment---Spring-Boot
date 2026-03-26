package backend.riskmanagement.repository;

import backend.riskmanagement.entity.PlaceArea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlaceAreaRepository extends JpaRepository<PlaceArea, Long> {
    Optional<PlaceArea> findByName(String name);
}
