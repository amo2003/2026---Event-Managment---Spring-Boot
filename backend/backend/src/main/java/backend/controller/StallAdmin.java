package backend.controller;

import backend.model.StallRegistration;
import backend.repository.StallRegistrationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("http://localhost:3000")
public class StallAdmin {

    private final StallRegistrationRepository stallRepo;

    public StallAdmin(StallRegistrationRepository stallRepo){
        this.stallRepo = stallRepo;
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
        return stallRepo.save(stall);
    }

    @PutMapping("/reject-payment/{id}")
    public StallRegistration rejectPayment(@PathVariable Long id){
        StallRegistration stall = stallRepo.findById(id).orElseThrow();
        stall.setPaymentStatus("REJECTED");
        return stallRepo.save(stall);
    }
}