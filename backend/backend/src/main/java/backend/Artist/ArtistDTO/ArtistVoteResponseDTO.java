package backend.Artist.ArtistDTO;

public class ArtistVoteResponseDTO {

    private Long artistId;
    private Long eventId;
    private Long voteCount;

    public ArtistVoteResponseDTO(Long artistId, Long eventId, Long voteCount) {
        this.artistId = artistId;
        this.eventId = eventId;
        this.voteCount = voteCount;
    }

    public Long getArtistId() {
        return artistId;
    }

    public Long getEventId() {
        return eventId;
    }

    public Long getVoteCount() {
        return voteCount;
    }
}