package backend.riskmanagement.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPasswordResponse {

    private String message;
    private String resetCode;
}