package backend.model.ArtistModel;

import jakarta.persistence.*;

@Entity
@Table(name = "artist_votes")
public class ArtistVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long artistId;

    @Column(nullable = false)
    private Long eventId;

    @Column(nullable = false)
    private String studentId;

    public ArtistVote() {
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

    public String getStudentId() {
        return studentId;
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

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }
}