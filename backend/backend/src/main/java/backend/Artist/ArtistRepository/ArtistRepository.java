package backend.repository.ArtistRepository;

import backend.model.ArtistModel.Artist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArtistRepository extends JpaRepository<Artist, Long> {
    Optional<Artist> findByEmail(String email);
}