package backend.Society_Stall.Service;

import backend.Society_Stall.model.StallOwner;
import backend.Society_Stall.model.StallRegistration;
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
            return;
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

    public void sendFacultyNotificationEmail(
            String toEmail,
            String deanName,
            String facultyName,
            String eventName,
            String societyName,
            String eventDate,
            String startTime,
            String endTime,
            String venue,
            String description,
            String contactNumber,
            String artists,
            String approvalToken
    ) {
        String subject = "Event Notification: " + eventName + " — Pending Approval";
        String approveUrl = "http://localhost:3000/dean/respond/" + approvalToken + "?action=APPROVED";
        String rejectUrl  = "http://localhost:3000/dean/respond/" + approvalToken + "?action=REJECTED";

        StringBuilder body = new StringBuilder();
        body.append("Dear ").append(deanName).append(",\n\n");
        body.append("We would like to inform you about an upcoming event submitted for approval.\n");
        body.append("Please review the details below:\n\n");
        body.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        body.append("EVENT DETAILS\n");
        body.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        body.append("Event Name    : ").append(eventName).append("\n");
        body.append("Society       : ").append(societyName).append("\n");
        body.append("Faculty       : ").append(facultyName).append("\n");
        body.append("Date          : ").append(eventDate).append("\n");
        body.append("Time          : ").append(startTime).append(" – ").append(endTime).append("\n");
        body.append("Venue         : ").append(venue).append("\n");
        if (contactNumber != null && !contactNumber.isBlank())
            body.append("Contact       : ").append(contactNumber).append("\n");
        if (artists != null && !artists.isBlank())
            body.append("Artists       : ").append(artists).append("\n");
        if (description != null && !description.isBlank())
            body.append("\nDescription:\n").append(description).append("\n");
        body.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
        body.append("Please respond by clicking one of the links below:\n\n");
        body.append("✅ APPROVE: ").append(approveUrl).append("\n\n");
        body.append("❌ REJECT : ").append(rejectUrl).append("\n\n");
        body.append("You may also add a comment when you open the link.\n\n");
        body.append("Regards,\nAdmin Portal\n");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body.toString());
        mailSender.send(message);
    }
}

