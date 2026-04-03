package backend.Service.ArtistService;

import backend.dto.ArtistDTO.ArtistVoteRequestDTO;
import backend.dto.ArtistDTO.ArtistVoteResponseDTO;
import backend.model.ArtistModel.ArtistVote;
import backend.repository.ArtistRepository.ArtistVoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArtistVoteService {

    private final ArtistVoteRepository artistVoteRepository;

    public ArtistVoteService(ArtistVoteRepository artistVoteRepository) {
        this.artistVoteRepository = artistVoteRepository;
    }

    public String voteForArtist(ArtistVoteRequestDTO requestDTO) {

        // prevent duplicate vote
        artistVoteRepository.findByStudentIdAndEventId(
                requestDTO.getStudentId(),
                requestDTO.getEventId()
        ).ifPresent(v -> {
            throw new RuntimeException("You have already voted for this event");
        });

        ArtistVote vote = new ArtistVote();
        vote.setArtistId(requestDTO.getArtistId());
        vote.setEventId(requestDTO.getEventId());
        vote.setStudentId(requestDTO.getStudentId());

        artistVoteRepository.save(vote);

        return "Vote submitted successfully";
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