package backend.ArtistPortal.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "artist_portal_feedback")
public class ArtistPortalFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long artistId;

    @Column(nullable = false)
    private Long eventId;

    @Column(nullable = false)
    private int rating;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(nullable = false)
    private boolean wouldPerformAgain;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    public ArtistPortalFeedback() {
    }

    public Long getId() {
        return id;
    }

    public Long getArtistId() {
        return artistId;
    }

    public Long getEventId() {
        return eventId;
    }

    public int getRating() {
        return rating;
    }

    public String getComments() {
        return comments;
    }

    public boolean isWouldPerformAgain() {
        return wouldPerformAgain;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setArtistId(Long artistId) {
        this.artistId = artistId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public void setWouldPerformAgain(boolean wouldPerformAgain) {
        this.wouldPerformAgain = wouldPerformAgain;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}