package backend.Society_Stall.Service.repository;

import backend.Society_Stall.Service.model.SocietyModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SocietyRepository extends JpaRepository<SocietyModel, Long> {

    boolean existsByEmail(String email);

    boolean existsByPinCode(String pinCode);

    Optional<SocietyModel> findByEmail(String email);

    Optional<SocietyModel> findByEmailAndPasswordAndPinCode(
            String email,
            String password,
            String pinCode
    );
}
