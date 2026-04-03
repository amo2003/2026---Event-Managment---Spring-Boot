package backend.riskmanagement.controller;

import backend.riskmanagement.dto.AuthResponse;
import backend.riskmanagement.dto.ChangePasswordRequest;
import backend.riskmanagement.dto.ForgotPasswordRequest;
import backend.riskmanagement.dto.ForgotPasswordResponse;
import backend.riskmanagement.dto.LoginRequest;
import backend.riskmanagement.dto.OfficerRegisterRequest;
import backend.riskmanagement.dto.ResetPasswordRequest;
import backend.riskmanagement.service.RiskAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class RiskAuthController {

    private final RiskAuthService authService;

    @PostMapping("/officer/register")
    public String registerOfficer(@Valid @RequestBody OfficerRegisterRequest request) {
        return authService.registerOfficer(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/change-password")
    public String changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        return authService.changePassword(authentication.getName(), request);
    }

    @PostMapping("/forgot-password")
    public ForgotPasswordResponse forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {
        return authService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public String resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }
}