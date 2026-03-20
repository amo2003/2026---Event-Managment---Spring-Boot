package backend.Society_Stall.Service.repository;

import backend.Society_Stall.Service.model.StallOwner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StallOwnerRepository extends JpaRepository<StallOwner, Long> {
    List<StallOwner> findByEmail(String email);

}