package backend.repository.ArtistRepository;

import backend.model.ArtistModel.ArtistVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ArtistVoteRepository extends JpaRepository<ArtistVote, Long> {

    List<ArtistVote> findByEventId(Long eventId);

    Long countByArtistIdAndEventId(Long artistId, Long eventId);

    Optional<ArtistVote> findByStudentIdAndEventId(String studentId, Long eventId);
}