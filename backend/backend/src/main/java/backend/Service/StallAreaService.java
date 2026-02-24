package backend.Service;

import backend.model.StallModel;
import backend.repository.StallAreaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StallAreaService {

    private final StallAreaRepository repo;

    public StallAreaService(StallAreaRepository repo) {
        this.repo = repo;
    }

    public List<StallModel> getAreasByEvent(Long eventId) {
        return repo.findByEventId(eventId);
    }
}