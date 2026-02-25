package backend.controller;

import backend.Service.EmailService;
import backend.Service.QRCodeService;
import backend.model.StallRegistration;
import backend.repository.StallRegistrationRepository;
import com.google.zxing.WriterException;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("http://localhost:3000")
public class StallAdmin {

    private final StallRegistrationRepository stallRepo;
    private final EmailService emailService;
    private final QRCodeService qrCodeService;

    public StallAdmin(StallRegistrationRepository stallRepo,
                      EmailService emailService,
                      QRCodeService qrCodeService){
        this.stallRepo = stallRepo;
        this.emailService = emailService;
        this.qrCodeService = qrCodeService;
    }

    // All stall registrations (history)
    @GetMapping("/stalls")
    public List<StallRegistration> getAllStalls() {
        return stallRepo.findAll();
    }

    @GetMapping("/pending-payments")
    public List<StallRegistration> getPendingPayments(){
        // Only slip-based pending payments should be reviewed by admin
        return stallRepo.findByPaymentStatusAndPaymentMethod("PENDING", "SLIP");
    }

    @PutMapping("/approve-payment/{id}")
    public StallRegistration approvePayment(@PathVariable Long id){
        StallRegistration stall = stallRepo.findById(id).orElseThrow();
        stall.setPaymentStatus("APPROVED");

        // generate QR code if not already existing
        if (stall.getQrCodeUrl() == null || stall.getQrCodeUrl().isBlank()) {
            try {
                generateAndAttachQrCode(stall);
            } catch (IOException | WriterException e) {
                // log and continue without failing approval
                e.printStackTrace();
            }
        }

        StallRegistration saved = stallRepo.save(stall);

        // send success email
        emailService.sendStallPlacedEmail(saved.getOwner(), saved);

        return saved;
    }

    @PutMapping("/reject-payment/{id}")
    public StallRegistration rejectPayment(@PathVariable Long id){
        StallRegistration stall = stallRepo.findById(id).orElseThrow();
        stall.setPaymentStatus("REJECTED");
        return stallRepo.save(stall);
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