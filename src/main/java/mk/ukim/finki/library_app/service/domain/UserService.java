package mk.ukim.finki.library_app.service.domain;

import mk.ukim.finki.library_app.model.domain.User;

import java.util.Optional;

public interface UserService {

    Optional<User> findByUsername(String username);

    User registerUser(String username, String password, String role);
}