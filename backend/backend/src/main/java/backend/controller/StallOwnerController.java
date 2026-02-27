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
    private final QRCodeService qrCodeService;

    public StallOwnerController(StallOwnerRepository ownerRepo,
                                StallRegistrationRepository stallRepo,
                                EmailService emailService,
                                QRCodeService qrCodeService) {
        this.ownerRepo = ownerRepo;
        this.stallRepo = stallRepo;
        this.emailService = emailService;
        this.qrCodeService = qrCodeService;
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
    // Forgot Password - Reset password by email
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> resetData) {
        String email = resetData.get("email");
        String newPassword = resetData.get("password");

        System.out.println("Stall Owner forgot password request for email: " + email);

        List<StallOwner> owners = ownerRepo.findByEmail(email);
        if (owners.isEmpty()) {
            System.out.println("Email not found: " + email);
            return ResponseEntity.status(404).body(Map.of("message", "Email not found!"));
        }

        StallOwner owner = owners.get(0);
        System.out.println("Stall Owner found: " + owner.getOwnerName());
        
        owner.setPassword(newPassword);
        ownerRepo.save(owner);

        System.out.println("Password updated successfully for: " + email);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully!"));
    }

    // Get owner details by ID
    @GetMapping("/{ownerId}/details")
    public ResponseEntity<StallOwner> getOwnerDetails(@PathVariable Long ownerId) {
        StallOwner owner = ownerRepo.findById(ownerId).orElse(null);
        if (owner == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(owner);
    }

    // StallOwner's stalls
    @GetMapping("/{ownerId}/stalls")
    public ResponseEntity<List<StallRegistration>> getStalls(@PathVariable Long ownerId){
        List<StallRegistration> stalls = stallRepo.findByOwnerId(ownerId);
        return ResponseEntity.ok(stalls);
    }
    // Download QR code image
    @GetMapping("/{ownerId}/stalls/{stallId}/qr")
    public ResponseEntity<byte[]> downloadQRCode(
            @PathVariable Long ownerId,
            @PathVariable Long stallId
    ) {
        try {
            StallRegistration stall = stallRepo.findById(stallId).orElse(null);
            if (stall == null) {
                return ResponseEntity.notFound().build();
            }

            // Verify ownership
            if (stall.getOwner() == null || !stall.getOwner().getId().equals(ownerId)) {
                return ResponseEntity.status(403).build();
            }

            if (stall.getQrCodeUrl() == null || stall.getQrCodeUrl().isBlank()) {
                return ResponseEntity.notFound().build();
            }

            // Read QR code file
            String projectRoot = new File(".").getCanonicalPath();
            String qrPath = stall.getQrCodeUrl().replace("/uploads/qrcodes/", "");
            File qrFile = new File(projectRoot + File.separator + "uploads" + File.separator + "qrcodes" + File.separator + qrPath);

            if (!qrFile.exists()) {
                return ResponseEntity.notFound().build();
            }

            BufferedImage qrImage = ImageIO.read(qrFile);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(qrImage, "PNG", baos);
            byte[] imageBytes = baos.toByteArray();

            return ResponseEntity.ok()
                    .header("Content-Type", "image/png")
                    .header("Content-Disposition", "inline; filename=\"qr-code.png\"")
                    .body(imageBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
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
        
        // Generate QR code for card payment
        if (stall.getQrCodeUrl() == null || stall.getQrCodeUrl().isBlank()) {
            try {
                generateAndAttachQrCode(stall);
            } catch (IOException | WriterException e) {
                e.printStackTrace();
                // Continue without QR code if generation fails
            }
        }
        
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

    // Delete stall registration
    @DeleteMapping("/{ownerId}/stalls/{stallId}")
    public ResponseEntity<Map<String, String>> deleteStall(
            @PathVariable Long ownerId,
            @PathVariable Long stallId
    ) {
        StallRegistration stall = stallRepo.findById(stallId).orElse(null);
        if (stall == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Verify ownership
        if (stall.getOwner() == null || !stall.getOwner().getId().equals(ownerId)) {
            return ResponseEntity.status(403).build();
        }

        // Delete the stall
        stallRepo.delete(stall);
        
        return ResponseEntity.ok(Map.of("message", "Stall deleted successfully"));
    }

    // Helper to generate and save QR code image file for a stall
    private void generateAndAttachQrCode(StallRegistration stall) throws IOException, WriterException {
        String projectRoot = new File(".").getCanonicalPath();
        String qrDirPath = projectRoot + File.separator + "uploads" + File.separator + "qrcodes";
        File qrDir = new File(qrDirPath);
        if (!qrDir.exists()) qrDir.mkdirs();

        String text = "Event Stall QR\n"
                + "Business: " + stall.getBusinessName() + "\n"
                + "Product: " + stall.getProductType() + "\n"
                + "Package: " + stall.getPackageType() + "\n"
                + "Amount: Rs. " + (stall.getAmount() != null ? stall.getAmount() : "") + "\n"
                + "Event ID: " + stall.getEventId();

        BufferedImage qrImage = qrCodeService.generateQRCodeImage(text, 300, 300);

        String fileName = UUID.randomUUID() + "_stall_" + stall.getId() + ".png";
        File outFile = new File(qrDir, fileName);
        ImageIO.write(qrImage, "PNG", outFile);

        // public URL for frontend
        stall.setQrCodeUrl("/uploads/qrcodes/" + fileName);
    }

}