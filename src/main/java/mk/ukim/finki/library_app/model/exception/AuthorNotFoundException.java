package mk.ukim.finki.library_app.model.exception;

public class AuthorNotFoundException extends RuntimeException {
    public AuthorNotFoundException(Long id) {
        super("An author with id %d does not exist.".formatted(id));
    }
}
