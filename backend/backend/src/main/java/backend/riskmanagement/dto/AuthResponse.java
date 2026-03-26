package backend.riskmanagement.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {
    private String token;
    private String email;
    private String fullName;
    private String role;
    private Boolean mustChangePassword;
}