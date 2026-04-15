package backend.ArtistPortal.dto;

public class ArtistPortalFeedbackDTO {
    private Long artistId;
    private Long eventId;
    private int rating;
    private String comments;
    private boolean wouldPerformAgain;

    public ArtistPortalFeedbackDTO() {
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
}