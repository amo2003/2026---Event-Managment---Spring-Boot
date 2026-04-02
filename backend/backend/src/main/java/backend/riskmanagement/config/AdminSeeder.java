package backend.riskmanagement.config;

import com.example.Risk_new.entity.AppUser;
import com.example.Risk_new.enums.SystemRole;
import com.example.Risk_new.repository.AppUserRepository;
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
        String adminEmail = "admin@risk.com";

        if (!appUserRepository.existsByEmail(adminEmail)) {
            AppUser admin = new AppUser();
            admin.setFullName("System Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(SystemRole.ADMIN);
            admin.setEnabled(true);
            admin.setMustChangePassword(false);

            appUserRepository.save(admin);
        }
    }
}