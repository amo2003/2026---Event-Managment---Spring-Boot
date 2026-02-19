package backend.controller;

import backend.dto.LoginResponse;
import backend.exception.SoceityNotFoundException;
import backend.model.SocietyModel;
import backend.repository.SocietyRepository;
import backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/society")
@CrossOrigin("http://localhost:3000")
public class Soceity {

    @Autowired
    private SocietyRepository societyRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // REGISTER
    @PostMapping("/register")
    public SocietyModel registerSociety(@RequestBody SocietyModel society) {
        if (societyRepository.existsByEmail(society.getEmail())) {
            throw new SoceityNotFoundException("Email already registered!");
        }
        society.setPinCode(generateUniquePin());
        return societyRepository.save(society);
    }

    // LOGIN – returns JWT token
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginSociety(@RequestBody SocietyModel loginData) {
        SocietyModel society = societyRepository
                .findByEmailAndPasswordAndPinCode(
                        loginData.getEmail(),
                        loginData.getPassword(),
                        loginData.getPinCode()
                )
                .orElseThrow(() ->
                        new SoceityNotFoundException("Invalid Email, Password or PIN"));

        // generate JWT token
        String jwtToken = jwtUtil.generateToken(society.getEmail());

        // return full response
        LoginResponse response = new LoginResponse(
                society.getName(),
                society.getEmail(),
                "Society",
                jwtToken,
                society.getFaculty(),
                society.getId()
        );

        return ResponseEntity.ok(response);
    }

    //get all societies
    @GetMapping("/all")
    public List<SocietyModel> getAllSociety() {
        return societyRepository.findAll();
    }

    // Get single society profile by ID
    @GetMapping("/profile/{societyId}")
    public SocietyModel getProfile(@PathVariable Long societyId) {
        return societyRepository.findById(societyId)
                .orElseThrow(() -> new SoceityNotFoundException("Society not found!"));
    }


    //get by id and update profile
    @PostMapping("/profile/{societyId}")
    public SocietyModel createOrUpdateProfile(
            @PathVariable Long societyId,
            @RequestBody SocietyModel profileData
    ) {
        SocietyModel society = societyRepository.findById(societyId)
                .orElseThrow(() -> new SoceityNotFoundException("Society not found!"));

        // Update profile fields (adjust as per your SocietyModel)
        society.setName(profileData.getName());
        society.setFaculty(profileData.getFaculty());
        society.setPresidentName(profileData.getPresidentName());
        society.setEmail(profileData.getEmail());
        society.setPassword(profileData.getPassword());
        society.setContactNumber(profileData.getContactNumber());
        society.setAdvisorName(profileData.getAdvisorName());
        society.setPinCode(profileData.getPinCode());


        return societyRepository.save(society);
    }

    //DELETE SOCIETY
    @DeleteMapping("/delete/{societyId}")
    public ResponseEntity<String> deleteSociety(@PathVariable Long societyId) {
        SocietyModel society = societyRepository.findById(societyId)
                .orElseThrow(() -> new SoceityNotFoundException("Society not found!"));

        societyRepository.delete(society);
        return ResponseEntity.ok("Society deleted successfully.");
    }

    // PIN GENERATOR
    private String generateUniquePin() {
        String pin;
        do {
            int number = 100000 + (int) (Math.random() * 900000);
            pin = "SOC-" + number;
        } while (societyRepository.existsByPinCode(pin));
        return pin;
    }
}
