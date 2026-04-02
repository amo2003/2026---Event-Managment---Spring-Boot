package backend.riskmanagement.config;


import backend.riskmanagement.entity.PlaceArea;
import backend.riskmanagement.repository.PlaceAreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final PlaceAreaRepository placeAreaRepository;

    @Override
    public void run(String... args) {
        createPlaceIfNotExists("Main Building", "Main academic and administrative building");
        createPlaceIfNotExists("New Building", "New campus building area");
        createPlaceIfNotExists("Playground", "Sports and outdoor activity area");
        createPlaceIfNotExists("Auditorium", "Main event and stage area");
        createPlaceIfNotExists("Outdoor space", "Open outdoor event space");
        createPlaceIfNotExists("Buiseness faculty", "Business faculty building area");
        createPlaceIfNotExists("Birdnest", "Birdnest campus location");
    }

    private void createPlaceIfNotExists(String name, String description) {
        if (placeAreaRepository.findByName(name).isEmpty()) {
            PlaceArea placeArea = new PlaceArea();
            placeArea.setName(name);
            placeArea.setDescription(description);
            placeArea.setIsActive(true);
            placeAreaRepository.save(placeArea);
        }
    }
}