package backend.Artist.ArtistController;

import backend.Artist.ArtistService.DashboardService;
import backend.Artist.ArtistDTO.DashboardSummaryDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/artist-dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class ArtistDashboardController {

    private final DashboardService dashboardService;

    public ArtistDashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/test")
    public String test() {
        return "Artist dashboard controller working";
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<DashboardSummaryDTO> getSummaryByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(dashboardService.getSummaryByEvent(eventId));
    }
}