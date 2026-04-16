package backend.Artist.ArtistDTO;

public class ArtistVoteRequestDTO {

    private Long artistId;
    private Long eventId;
    private String studentId;

    public Long getArtistId() {
        return artistId;
    }

    public Long getEventId() {
        return eventId;
    }

    public String getStudentId() {
        return studentId;
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