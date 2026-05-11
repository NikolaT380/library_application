package mk.ukim.finki.library_app.web.controller;

import mk.ukim.finki.library_app.model.domain.User;
import mk.ukim.finki.library_app.security.JwtService;
import mk.ukim.finki.library_app.service.domain.UserService;
import mk.ukim.finki.library_app.web.dto.JwtResponse;
import mk.ukim.finki.library_app.web.dto.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager,
                          UserDetailsService userDetailsService,
                          JwtService jwtService,
                          UserService userService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        UserDetails user = userDetailsService.loadUserByUsername(request.getUsername());
        String jwtToken = jwtService.generateToken(user);

        return ResponseEntity.ok(new JwtResponse(jwtToken));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody LoginRequest request) {
        try {
            User newUser = userService.registerUser(
                    request.getUsername(),
                    request.getPassword(),
                    "ROLE_USER"
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(newUser.getUsername());
            String jwtToken = jwtService.generateToken(userDetails);

            return ResponseEntity.ok(new JwtResponse(jwtToken));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}