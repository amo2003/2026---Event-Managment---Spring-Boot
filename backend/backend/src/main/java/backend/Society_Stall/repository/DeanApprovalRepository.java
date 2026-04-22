package backend.Society_Stall.repository;

import backend.Society_Stall.model.DeanApproval;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeanApprovalRepository extends JpaRepository<DeanApproval, Long> {
    Optional<DeanApproval> findByToken(String token);
    List<DeanApproval> findAllByOrderBySentAtDesc();
    List<DeanApproval> findByEventId(Long eventId);
}
