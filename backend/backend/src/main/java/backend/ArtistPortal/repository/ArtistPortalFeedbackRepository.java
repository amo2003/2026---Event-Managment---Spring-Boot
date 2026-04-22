package backend.ArtistPortal.repository;

import backend.ArtistPortal.model.ArtistPortalFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArtistPortalFeedbackRepository extends JpaRepository<ArtistPortalFeedback, Long> {
    Optional<ArtistPortalFeedback> findByArtistIdAndEventId(Long artistId, Long eventId);
}