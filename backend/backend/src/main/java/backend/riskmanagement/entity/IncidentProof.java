package backend.riskmanagement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "incident_proofs")
@Getter
@Setter
public class IncidentProof extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String filePath;

    private String fileType;

    @ManyToOne
    @JoinColumn(name = "incident_id", nullable = false)
    private Incident incident;
}