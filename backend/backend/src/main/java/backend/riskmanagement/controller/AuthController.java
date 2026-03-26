package backend.riskmanagement.controller;

import backend.riskmanagement.dto.AuthResponse;
import backend.riskmanagement.dto.ChangePasswordRequest;
import backend.riskmanagement.dto.LoginRequest;
import backend.riskmanagement.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/change-password")
    public String changePassword(Authentication authentication,
                                 @Valid @RequestBody ChangePasswordRequest request) {
        return authService.changePassword(authentication.getName(), request);
    }
}