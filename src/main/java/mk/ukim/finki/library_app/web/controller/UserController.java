package mk.ukim.finki.library_app.web.controller;

import mk.ukim.finki.library_app.model.domain.BooksViewMode;
import mk.ukim.finki.library_app.service.domain.UserService;
import mk.ukim.finki.library_app.web.dto.BooksViewModeRequest;
import mk.ukim.finki.library_app.web.dto.BooksViewModeResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/preferences")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/books-view")
    public ResponseEntity<BooksViewModeResponse> getBooksViewMode(Authentication authentication) {
        String username = authentication.getName();
        BooksViewMode booksViewMode = userService.getBooksViewMode(username);
        return ResponseEntity.ok(new BooksViewModeResponse(booksViewMode));
    }

    @PutMapping("/books-view")
    public ResponseEntity<BooksViewModeResponse> updateBooksViewMode(
            Authentication authentication,
            @RequestBody BooksViewModeRequest request
    ) {
        String username = authentication.getName();
        BooksViewMode updated = userService.updateBooksViewMode(username, request.getBooksViewMode());
        return ResponseEntity.ok(new BooksViewModeResponse(updated));
    }
}