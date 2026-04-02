package backend.riskmanagement.entity;


import backend.riskmanagement.enums.IncidentPriority;
import backend.riskmanagement.enums.IncidentStatus;
import backend.riskmanagement.enums.IncidentType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "incidents")
@Getter
@Setter
public class Incident extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tracking_code", unique = true, length = 40)
    private String trackingCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentType incidentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentStatus status = IncidentStatus.REPORTED;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(name = "reported_by", nullable = false)
    private String reportedBy;

    @Column(name = "exact_location", nullable = false, length = 500)
    private String exactLocation;

    @ManyToOne
    @JoinColumn(name = "place_area_id", nullable = false)
    private PlaceArea placeArea;

    @ManyToOne
    @JoinColumn(name = "assigned_officer_id")
    private Officer assignedOfficer;

    @Column(name = "reported_time")
    private LocalDateTime reportedTime;

    @Column(name = "assigned_time")
    private LocalDateTime assignedTime;

    @Column(name = "action_started_time")
    private LocalDateTime actionStartedTime;

    @Column(name = "resolved_time")
    private LocalDateTime resolvedTime;

    @Column(length = 1000)
    private String resolutionSummary;

    @OneToMany(mappedBy = "incident", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<IncidentProof> proofs = new ArrayList<>();

    @OneToMany(mappedBy = "incident", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<IncidentLog> logs = new ArrayList<>();
}