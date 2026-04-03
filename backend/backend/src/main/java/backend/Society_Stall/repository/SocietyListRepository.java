package backend.Society_Stall.Service.repository;

import backend.Society_Stall.Service.model.SocietyListModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SocietyListRepository extends JpaRepository<SocietyListModel, Long> {
    boolean existsByName(String name);
}