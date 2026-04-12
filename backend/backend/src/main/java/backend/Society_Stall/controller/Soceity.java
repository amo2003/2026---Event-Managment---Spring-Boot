package backend.Society_Stall.controller;

import backend.Society_Stall.Service.EmailService;
import backend.Society_Stall.Service.OtpService;
import backend.Society_Stall.dto.LoginResponse;
import backend.Society_Stall.exception.SoceityNotFoundException;
import backend.Society_Stall.model.SocietyModel;
import backend.Society_Stall.repository.SocietyRepository;
import backend.Society_Stall.security.JwtUtil;
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

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpService otpService;

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

    // STEP 1 — Send OTP
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody java.util.Map<String, String> body) {
        String email = body.get("email");
        SocietyModel society = societyRepository.findByEmail(email).orElse(null);
        if (society == null) return ResponseEntity.status(404).body("Email not found!");
        String otp = otpService.generateAndStore(email);
        emailService.sendOtpEmail(email, otp, society.getName());
        return ResponseEntity.ok("OTP sent to " + email);
    }

    // STEP 2 — Verify OTP + reset password
    @PostMapping("/verify-otp-reset")
    public ResponseEntity<?> verifyOtpReset(@RequestBody java.util.Map<String, String> body) {
        String email = body.get("email");
        String otp   = body.get("otp");
        String newPw = body.get("password");
        if (!otpService.verify(email, otp)) return ResponseEntity.status(400).body("Invalid or expired OTP!");
        SocietyModel society = societyRepository.findByEmail(email).orElse(null);
        if (society == null) return ResponseEntity.status(404).body("Email not found!");
        society.setPassword(newPw);
        societyRepository.save(society);
        otpService.invalidate(email);
        return ResponseEntity.ok("Password reset successfully!");
    }

    // FORGOT PASSWORD - kept for backward compat
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody SocietyModel resetData) {
        try {
            System.out.println("Forgot password request for email: " + resetData.getEmail());
            
            SocietyModel society = societyRepository.findByEmail(resetData.getEmail())
                    .orElseThrow(() -> new SoceityNotFoundException("Email not found!"));

            System.out.println("Society found: " + society.getName());
            
            // Update password
            society.setPassword(resetData.getPassword());
            societyRepository.save(society);

            System.out.println("Password updated successfully");
            
            return ResponseEntity.ok("Password reset successfully!");
        } catch (SoceityNotFoundException e) {
            System.out.println("Email not found: " + resetData.getEmail());
            return ResponseEntity.status(404).body("Email not found!");
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Password reset failed!");
        }
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
