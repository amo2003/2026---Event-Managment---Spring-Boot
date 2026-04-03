package backend.repository.ArtistRepository;

import backend.model.ArtistModel.ArtistInquiry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArtistInquiryRepository extends JpaRepository<ArtistInquiry, Long> {
    List<ArtistInquiry> findByArtistId(Long artistId);
    List<ArtistInquiry> findByEventId(Long eventId);
}