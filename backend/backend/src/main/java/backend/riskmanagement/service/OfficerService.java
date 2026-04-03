package backend.riskmanagement.service;


import backend.riskmanagement.dto.OfficerCreateRequest;
import backend.riskmanagement.entity.AppUser;
import backend.riskmanagement.entity.Officer;
import backend.riskmanagement.enums.SystemRole;
import backend.riskmanagement.exception.ResourceNotFoundException;
import backend.riskmanagement.repository.AppUserRepository;
import backend.riskmanagement.repository.OfficerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OfficerService {

    private final OfficerRepository officerRepository;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public Officer createOfficer(OfficerCreateRequest request) {
        if (officerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Officer already exists with this email");
        }

        if (appUserRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Login account already exists with this email");
        }

        Officer officer = new Officer();
        officer.setFullName(request.getFullName());
        officer.setEmail(request.getEmail());
        officer.setPhoneNumber(request.getPhoneNumber());
        officer.setRole(request.getRole());
        officer.setIsAvailable(true);
        officer.setActiveIncidentCount(0);

        Officer savedOfficer = officerRepository.save(officer);

        AppUser appUser = new AppUser();
        appUser.setFullName(request.getFullName());
        appUser.setEmail(request.getEmail());
        appUser.setPassword(passwordEncoder.encode(request.getPassword()));
        appUser.setRole(SystemRole.OFFICER);
        appUser.setEnabled(true);
        appUser.setMustChangePassword(true);

        appUserRepository.save(appUser);

        return savedOfficer;
    }

    public List<Officer> getAllOfficers() {
        return officerRepository.findAll();
    }

    public List<Officer> getAvailableOfficers() {
        return officerRepository.findByIsAvailableTrueOrderByActiveIncidentCountAsc();
    }

    public Officer getOfficerById(Long id) {
        return officerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found with id: " + id));
    }
}