package backend.event_friend_tracker.service;

import backend.event_friend_tracker.model.User;
import backend.event_friend_tracker.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public User register(User user){
        return userRepository.save(user);
    }
}
