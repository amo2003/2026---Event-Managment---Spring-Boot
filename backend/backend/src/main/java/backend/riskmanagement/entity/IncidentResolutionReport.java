package backend.riskmanagement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "incident_resolution_reports")
@Getter
@Setter
public class IncidentResolutionReport extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1500)
    private String summary;

    @Column(nullable = false, length = 1500)
    private String actionTaken;

    @Column(length = 1500)
    private String recommendations;

    @Column(nullable = false)
    private String preparedBy;

    @OneToOne
    @JoinColumn(name = "incident_id", nullable = false, unique = true)
    private Incident incident;
}
