package backend.Artist.ArtistService;

import backend.Artist.ArtistDTO.ArtistVoteRequestDTO;
import backend.Artist.ArtistDTO.ArtistVoteResponseDTO;
import backend.Artist.ArtistModel.ArtistVote;
import backend.Artist.ArtistRepository.ArtistRepository;
import backend.Artist.ArtistRepository.ArtistVoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArtistVoteService {

    private final ArtistVoteRepository artistVoteRepository;
    private final ArtistRepository artistRepository;

    public ArtistVoteService(ArtistVoteRepository artistVoteRepository,
                             ArtistRepository artistRepository) {
        this.artistVoteRepository = artistVoteRepository;
        this.artistRepository = artistRepository;
    }

    public String voteForArtist(ArtistVoteRequestDTO requestDTO) {
        if (requestDTO == null) {
            throw new IllegalArgumentException("Vote request is missing.");
        }

        if (requestDTO.getArtistId() == null) {
            throw new IllegalArgumentException("Artist is required.");
        }

        if (requestDTO.getEventId() == null) {
            throw new IllegalArgumentException("Event is required.");
        }

        if (requestDTO.getStudentId() == null || requestDTO.getStudentId().trim().isEmpty()) {
            throw new IllegalArgumentException("Student ID is required.");
        }

        String studentId = requestDTO.getStudentId().trim();

        artistRepository.findById(requestDTO.getArtistId())
                .orElseThrow(() -> new IllegalArgumentException("Selected artist was not found."));

        artistVoteRepository.findByStudentIdAndEventId(studentId, requestDTO.getEventId())
                .ifPresent(v -> {
                    throw new IllegalStateException("You have already voted for this event.");
                });

        ArtistVote vote = new ArtistVote();
        vote.setArtistId(requestDTO.getArtistId());
        vote.setEventId(requestDTO.getEventId());
        vote.setStudentId(studentId);

        artistVoteRepository.save(vote);

        return "Vote submitted successfully.";
    }

    public List<ArtistVoteResponseDTO> getVoteResults(Long eventId) {
        List<ArtistVote> votes = artistVoteRepository.findByEventId(eventId);

        return votes.stream()
                .collect(Collectors.groupingBy(ArtistVote::getArtistId, Collectors.counting()))
                .entrySet()
                .stream()
                .map(entry -> new ArtistVoteResponseDTO(
                        entry.getKey(),
                        eventId,
                        entry.getValue()
                ))
                .collect(Collectors.toList());
    }
}