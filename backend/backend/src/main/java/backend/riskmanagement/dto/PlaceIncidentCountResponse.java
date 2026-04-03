package backend.riskmanagement.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceIncidentCountResponse {

    private Long placeAreaId;
    private String placeAreaName;
    private Long incidentCount;
}