package backend.riskmanagement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "incident_logs")
@Getter
@Setter
public class IncidentLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String action;

    @Column(nullable = false)
    private String actionBy;

    @ManyToOne
    @JoinColumn(name = "incident_id", nullable = false)
    private Incident incident;
}