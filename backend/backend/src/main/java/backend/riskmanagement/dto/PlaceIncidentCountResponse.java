package backend.riskmanagement.dto;



import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PlaceIncidentCountResponse {

    private Long placeAreaId;
    private String placeAreaName;
    private Long incidentCount;
}
