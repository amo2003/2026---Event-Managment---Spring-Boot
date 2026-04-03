package backend.riskmanagement.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignOfficerRequest {

    @NotNull(message = "Officer id is required")
    private Long officerId;
}