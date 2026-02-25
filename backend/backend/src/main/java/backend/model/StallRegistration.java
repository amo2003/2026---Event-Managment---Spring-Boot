package backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class StallRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String businessName;
    private String productType;

    // Package selection (Gold / Silver / Platinum)
    private String packageType;
    private Double amount;

    // Payment
    private String paymentMethod; // CARD or SLIP
    private String paymentStatus; // NOT_PAID, PENDING, APPROVED, REJECTED
    private String slipUrl;
    private String slipNote;

    // QR code image URL (generated after successful stall placement)
    private String qrCodeUrl;

    private LocalDateTime registeredAt;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private StallOwner owner; // <-- This is required

    private Long eventId; // reference to event

    @PrePersist
    public void prePersist() {
        if (registeredAt == null) {
            registeredAt = LocalDateTime.now();
        }
        if (paymentStatus == null) {
            paymentStatus = "NOT_PAID";
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }

    public String getPackageType() { return packageType; }
    public void setPackageType(String packageType) { this.packageType = packageType; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getSlipUrl() { return slipUrl; }
    public void setSlipUrl(String slipUrl) { this.slipUrl = slipUrl; }

    public String getSlipNote() { return slipNote; }
    public void setSlipNote(String slipNote) { this.slipNote = slipNote; }

    public String getQrCodeUrl() { return qrCodeUrl; }
    public void setQrCodeUrl(String qrCodeUrl) { this.qrCodeUrl = qrCodeUrl; }

    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }

    public StallOwner getOwner() { return owner; }
    public void setOwner(StallOwner owner) { this.owner = owner; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
}