package mk.ukim.finki.library_app.service.domain.impl;

import mk.ukim.finki.library_app.model.domain.User;
import mk.ukim.finki.library_app.repository.UserRepository;
import mk.ukim.finki.library_app.service.domain.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public User registerUser(String username, String password, String role) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("User with username " + username + " already exists!");
        }

        User user = new User(
                username,
                passwordEncoder.encode(password),
                role != null ? role : "ROLE_USER"
        );

        return userRepository.save(user);
    }
}