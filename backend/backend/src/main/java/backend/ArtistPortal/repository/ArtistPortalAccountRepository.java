package backend.ArtistPortal.repository;

import backend.ArtistPortal.model.ArtistPortalAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArtistPortalAccountRepository extends JpaRepository<ArtistPortalAccount, Long> {
    Optional<ArtistPortalAccount> findByEmail(String email);
    Optional<ArtistPortalAccount> findByArtistId(Long artistId);
}