package backend.riskmanagement.controller;


import backend.riskmanagement.entity.PlaceArea;
import backend.riskmanagement.service.PlaceAreaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/place-areas")
@RequiredArgsConstructor
public class PlaceAreaController {

    private final PlaceAreaService placeAreaService;

    @GetMapping
    public List<PlaceArea> getAllPlaceAreas() {
        return placeAreaService.getAllPlaceAreas();
    }
}