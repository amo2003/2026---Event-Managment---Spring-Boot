package backend.Society_Stall.Service.repository;

import backend.Society_Stall.Service.model.EventPayment;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

public interface EventPaymentRepository extends JpaRepository<EventPayment, Long> {

    @Modifying
    @Transactional
    void deleteByEventId(Long eventId);
}
