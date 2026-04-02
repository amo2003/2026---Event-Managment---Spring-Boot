package backend.riskmanagement.entity;


import backend.riskmanagement.enums.IncidentPriority;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "escalation_rules")
@Getter
@Setter
public class EscalationRule extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentPriority priority;

    @Column(nullable = false)
    private Integer escalationMinutes;

    @Column(nullable = false, length = 500)
    private String actionMessage;

    @Column(name = "is_active")
    private Boolean isActive = true;
}