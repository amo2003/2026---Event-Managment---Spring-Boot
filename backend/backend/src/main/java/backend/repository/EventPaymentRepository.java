package backend.repository;

import backend.model.EventPayment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventPaymentRepository extends JpaRepository<EventPayment, Long> {
}
