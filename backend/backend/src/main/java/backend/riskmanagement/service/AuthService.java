package backend.riskmanagement.service;

import backend.riskmanagement.dto.AuthResponse;
import backend.riskmanagement.dto.ChangePasswordRequest;
import backend.riskmanagement.dto.ForgotPasswordRequest;
import backend.riskmanagement.dto.ForgotPasswordResponse;
import backend.riskmanagement.dto.LoginRequest;
import backend.riskmanagement.dto.OfficerRegisterRequest;
import backend.riskmanagement.dto.ResetPasswordRequest;
import backend.riskmanagement.entity.AppUser;
import backend.riskmanagement.entity.Officer;
import backend.riskmanagement.enums.SystemRole;
import backend.riskmanagement.repository.AppUserRepository;
import backend.riskmanagement.repository.OfficerRepository;
import backend.riskmanagement.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final OfficerRepository officerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public String registerOfficer(OfficerRegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Password and confirm password do not match");
        }

        if (appUserRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Login account already exists with this email");
        }

        if (officerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Officer already exists with this email");
        }

        Officer officer = new Officer();
        officer.setFullName(request.getFullName());
        officer.setEmail(request.getEmail());
        officer.setPhoneNumber(request.getPhoneNumber());
        officer.setRole(request.getRole());
        officer.setIsAvailable(true);
        officer.setActiveIncidentCount(0);
        officerRepository.save(officer);

        AppUser appUser = new AppUser();
        appUser.setFullName(request.getFullName());
        appUser.setEmail(request.getEmail());
        appUser.setPassword(passwordEncoder.encode(request.getPassword()));
        appUser.setRole(SystemRole.OFFICER);
        appUser.setEnabled(true);
        appUser.setMustChangePassword(false);

        appUserRepository.save(appUser);

        return "Officer registered successfully";
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        AppUser user = appUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user.getEmail());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole().name());
        response.setMustChangePassword(user.getMustChangePassword());

        return response;
    }

    public String changePassword(String email, ChangePasswordRequest request) {
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New password and confirm password do not match");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new RuntimeException("New password must be different from current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);
        appUserRepository.save(user);

        return "Password changed successfully";
    }

    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
        AppUser user = appUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No account found for this email"));

        String resetCode = generateResetCode();

        user.setResetCode(resetCode);
        user.setResetCodeExpiry(LocalDateTime.now().plusMinutes(10));
        appUserRepository.save(user);

        ForgotPasswordResponse response = new ForgotPasswordResponse();
        response.setMessage("Reset code generated successfully");
        response.setResetCode(resetCode);

        return response;
    }

    public String resetPassword(ResetPasswordRequest request) {
        AppUser user = appUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No account found for this email"));

        if (user.getResetCode() == null || user.getResetCodeExpiry() == null) {
            throw new RuntimeException("No active reset request found");
        }

        if (!user.getResetCode().equals(request.getResetCode().trim())) {
            throw new RuntimeException("Invalid reset code");
        }

        if (user.getResetCodeExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset code has expired");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New password and confirm password do not match");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new RuntimeException("New password must be different from current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetCode(null);
        user.setResetCodeExpiry(null);
        user.setMustChangePassword(false);

        appUserRepository.save(user);

        return "Password reset successfully";
    }

    private String generateResetCode() {
        int code = 100000 + new Random().nextInt(900000);
        return String.valueOf(code);
    }
}