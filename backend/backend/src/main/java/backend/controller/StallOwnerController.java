package backend.controller;

import backend.Service.EmailService;
import backend.Service.QRCodeService;
import backend.model.StallOwner;
import backend.model.StallRegistration;
import backend.repository.StallOwnerRepository;
import backend.repository.StallRegistrationRepository;
import com.google.zxing.WriterException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.UUID;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stall-owner")
@CrossOrigin("http://localhost:3000")
public class StallOwnerController {

    private final StallOwnerRepository ownerRepo;
    private final StallRegistrationRepository stallRepo;
    private final EmailService emailService;

    public StallOwnerController(StallOwnerRepository ownerRepo,
                                StallRegistrationRepository stallRepo,
                                EmailService emailService) {
        this.ownerRepo = ownerRepo;
        this.stallRepo = stallRepo;
        this.emailService = emailService;
    }

    // Register stall owner
    @PostMapping("/register")
    public ResponseEntity<StallOwner> register(@RequestBody StallOwner owner) {
        // TODO: hash password for production
        StallOwner saved = ownerRepo.save(owner);
        return ResponseEntity.ok(saved);
    }

    // Login stall owner
    @PostMapping("/login")
    public ResponseEntity<StallOwner> login(@RequestBody Map<String,String> credentials){
        String email = credentials.get("email");
        String password = credentials.get("password");

        // Use Optional and pick first if multiple found (or enforce unique in DB)
        List<StallOwner> owners = ownerRepo.findByEmail(email); // change repo method to return List
        if (!owners.isEmpty()) {
            StallOwner owner = owners.get(0); // pick the first record
            if (owner.getPassword().equals(password)) {
                return ResponseEntity.ok(owner);
            }
        }

        return ResponseEntity.status(401).build();
    }

    // StallOwner's stalls
    @GetMapping("/{ownerId}/stalls")
    public ResponseEntity<List<StallRegistration>> getStalls(@PathVariable Long ownerId){
        List<StallRegistration> stalls = stallRepo.findByOwnerId(ownerId);
        return ResponseEntity.ok(stalls);
    }

    // Create a stall registration for an event (before payment)
    @PostMapping("/{ownerId}/stalls")
    public ResponseEntity<StallRegistration> createStall(
            @PathVariable Long ownerId,
            @RequestBody StallRegistration payload
    ) {
        StallOwner owner = ownerRepo.findById(ownerId).orElse(null);
        if (owner == null) {
            return ResponseEntity.notFound().build();
        }
        // Always create a new stall record so history of all placements is kept
        StallRegistration stall = new StallRegistration();
        stall.setOwner(owner);
        stall.setEventId(payload.getEventId());
        stall.setBusinessName(payload.getBusinessName());
        stall.setProductType(payload.getProductType());
        stall.setPackageType(payload.getPackageType());
        stall.setAmount(payload.getAmount());
        stall.setPaymentStatus("NOT_PAID");
        stall.setPaymentMethod(null);

        return ResponseEntity.ok(stallRepo.save(stall));
    }

    // Card payment (immediate approval)
    @PostMapping("/{ownerId}/pay-card")
    public ResponseEntity<StallRegistration> payByCard(
            @PathVariable Long ownerId,
            @RequestBody Map<String, Object> body
    ) {
        Object stallIdObj = body.get("stallId");
        if (stallIdObj == null) {
            return ResponseEntity.badRequest().build();
        }
        Long stallId = Long.valueOf(String.valueOf(stallIdObj));

        StallRegistration stall = stallRepo.findById(stallId).orElse(null);
        if (stall == null) {
            return ResponseEntity.notFound().build();
        }
        if (stall.getOwner() == null || stall.getOwner().getId() == null || !stall.getOwner().getId().equals(ownerId)) {
            return ResponseEntity.status(403).build();
        }

        // Store amount if provided
        if (body.get("amount") != null) {
            try {
                stall.setAmount(Double.valueOf(String.valueOf(body.get("amount"))));
            } catch (Exception ignored) {}
        }

        stall.setPaymentMethod("CARD");
        stall.setPaymentStatus("APPROVED");
        StallRegistration saved = stallRepo.save(stall);

        // send success email
        emailService.sendStallPlacedEmail(saved.getOwner(), saved);

        return ResponseEntity.ok(saved);
    }

    // Upload payment slip
    @PostMapping("/{ownerId}/upload-slip")
    public ResponseEntity<StallRegistration> uploadSlip(
            @PathVariable Long ownerId,
            @RequestParam MultipartFile slip,
            @RequestParam Long stallId,
            @RequestParam(required = false) String note
    ) throws IOException {
        StallRegistration stall = stallRepo.findById(stallId).orElseThrow();
        if(!stall.getOwner().getId().equals(ownerId)) {
            return ResponseEntity.status(403).build();
        }

        // Use project-relative absolute path to avoid Tomcat temp folder issues
        String projectRoot = new File(".").getCanonicalPath();
        String uploadsDir = projectRoot + File.separator + "uploads" + File.separator + "slips";
        File dir = new File(uploadsDir);
        if(!dir.exists()) dir.mkdirs();

        String safeName = UUID.randomUUID() + "_" + slip.getOriginalFilename();
        String filePath = uploadsDir + File.separator + safeName;

        // Save file
        slip.transferTo(new File(filePath));

        // Public URL that frontend can load: http://localhost:8080/uploads/slips/...
        stall.setSlipUrl("/uploads/slips/" + safeName);
        stall.setPaymentMethod("SLIP");
        stall.setPaymentStatus("PENDING");
        if (note != null && !note.isBlank()) {
            stall.setSlipNote(note);
        }
        stallRepo.save(stall);

        return ResponseEntity.ok(stall);
    }



}