package backend.controller;

import backend.dto.LoginResponse;
import backend.exception.SoceityNotFoundException;
import backend.model.SocietyModel;
import backend.repository.SocietyRepository;
import backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // LOGIN – returns JWT token + user info
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
                society.getFaculty() // ✅ include faculty
        );

        return ResponseEntity.ok(response);
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
