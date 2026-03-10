package mk.ukim.finki.library_app.model.exception;

public class BookNotFoundException extends RuntimeException {
    public BookNotFoundException(Long id) {
        super("A book with id %d does not exist.".formatted(id));
    }
}
