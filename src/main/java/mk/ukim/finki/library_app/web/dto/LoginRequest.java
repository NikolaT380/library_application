package mk.ukim.finki.library_app.web.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}