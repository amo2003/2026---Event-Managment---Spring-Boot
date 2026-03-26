package backend.riskmanagement.service;

import backend.riskmanagement.entity.PlaceArea;
import backend.riskmanagement.repository.PlaceAreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PlaceAreaService {

    private final PlaceAreaRepository placeAreaRepository;

    private static final List<String> ORDERED_PLACE_NAMES = List.of(
            "Main Building",
            "New Building",
            "Playground",
            "Auditorium",
            "Outdoor space",
            "Buiseness faculty",
            "Birdnest"
    );

    public List<PlaceArea> getAllPlaceAreas() {
        Map<String, Integer> orderMap = Map.of(
                "Main Building", 1,
                "New Building", 2,
                "Playground", 3,
                "Auditorium", 4,
                "Outdoor space", 5,
                "Buiseness faculty", 6,
                "Birdnest", 7
        );

        return placeAreaRepository.findAll()
                .stream()
                .filter(placeArea -> ORDERED_PLACE_NAMES.contains(placeArea.getName()))
                .sorted((a, b) -> Integer.compare(
                        orderMap.get(a.getName()),
                        orderMap.get(b.getName())
                ))
                .toList();
    }
}