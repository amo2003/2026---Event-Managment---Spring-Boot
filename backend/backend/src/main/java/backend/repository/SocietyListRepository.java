package backend.repository;

import backend.model.SocietyListModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SocietyListRepository extends JpaRepository<SocietyListModel, Long> {
    boolean existsByName(String name);
}