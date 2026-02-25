package backend.Service;

import backend.model.StallOwner;
import backend.model.StallRegistration;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendStallPlacedEmail(StallOwner owner, StallRegistration stall) {
        if (owner == null || owner.getEmail() == null || owner.getEmail().isBlank()) {
            return; // nothing to send
        }

        String to = owner.getEmail();
        String subject = "Stall Placed Successfully";

        StringBuilder body = new StringBuilder();
        body.append("Dear ").append(owner.getOwnerName() != null ? owner.getOwnerName() : "Stall Owner").append(",\n\n");
        body.append("Your stall has been successfully placed.\n\n");
        body.append("Details:\n");
        body.append("Business: ").append(stall.getBusinessName()).append("\n");
        body.append("Product: ").append(stall.getProductType()).append("\n");
        body.append("Package: ").append(stall.getPackageType()).append("\n");
        if (stall.getAmount() != null) {
            body.append("Amount: Rs. ").append(stall.getAmount()).append("\n");
        }
        body.append("Payment Status: ").append(stall.getPaymentStatus()).append("\n");
        if (stall.getPaymentMethod() != null) {
            body.append("Payment Method: ").append(stall.getPaymentMethod()).append("\n");
        }
        body.append("\nThank you.\n");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body.toString());

        mailSender.send(message);
    }
}

