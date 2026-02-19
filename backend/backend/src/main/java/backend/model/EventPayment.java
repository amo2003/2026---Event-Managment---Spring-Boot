package backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class EventPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long eventId;
    private Double amount;
    private String paymentMethod;

    private LocalDateTime paidAt;

    // Getters & Setters
public EventPayment(){}

    public EventPayment(Long id, Long eventId, Double amount, String paymentMethod, LocalDateTime paidAt) {
        this.id = id;
        this.eventId = eventId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paidAt = paidAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }
}
