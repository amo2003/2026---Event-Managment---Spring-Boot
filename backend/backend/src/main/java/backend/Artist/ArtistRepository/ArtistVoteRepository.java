package backend.Artist.ArtistRepository;

import backend.Artist.ArtistModel.ArtistVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ArtistVoteRepository extends JpaRepository<ArtistVote, Long> {
    Optional<ArtistVote> findByStudentIdAndEventId(String studentId, Long eventId);
    List<ArtistVote> findByEventId(Long eventId);
}