package backend.repository.ArtistRepository;

import backend.model.ArtistModel.ArtistLead;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArtistLeadRepository extends JpaRepository<ArtistLead, Long> {
    Optional<ArtistLead> findByEmail(String email);
}