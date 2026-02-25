package backend.repository;

import backend.model.StallRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StallRegistrationRepository extends JpaRepository<StallRegistration, Long> {

    List<StallRegistration> findByEventId(Long eventId);

    List<StallRegistration> findByOwnerId(Long ownerId);

    List<StallRegistration> findByPaymentStatus(String paymentStatus);

    List<StallRegistration> findByPaymentStatusAndPaymentMethod(String paymentStatus, String paymentMethod);

    List<StallRegistration> findByOwnerIdAndEventId(Long ownerId, Long eventId);
}