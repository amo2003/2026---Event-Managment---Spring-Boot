package backend.riskmanagement.entity;

import backend.riskmanagement.enums.OfficerRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "officers")
@Getter
@Setter
public class Officer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OfficerRole role;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @Column(name = "active_incident_count")
    private Integer activeIncidentCount = 0;
}