package backend.riskmanagement.config;

import backend.riskmanagement.entity.AppUser;
import backend.riskmanagement.enums.SystemRole;
import backend.riskmanagement.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "";

        if (!appUserRepository.existsByEmail(adminEmail)) {
            AppUser admin = new AppUser();
            admin.setFullName("System Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(""));
            admin.setRole(SystemRole.ADMIN);
            admin.setEnabled(true);
            admin.setMustChangePassword(false);

            appUserRepository.save(admin);
        }
    }
}