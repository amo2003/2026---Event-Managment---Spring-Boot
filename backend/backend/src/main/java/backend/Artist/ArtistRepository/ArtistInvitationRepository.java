package backend.Artist.ArtistRepository;

import backend.Artist.ArtistModel.ArtistInvitation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArtistInvitationRepository extends JpaRepository<ArtistInvitation, Long> {
    List<ArtistInvitation> findByArtistLeadId(Long artistLeadId);
    List<ArtistInvitation> findByEventId(Long eventId);
}