package mk.ukim.finki.library_app.model.exception;

public class InvalidBookStateException extends RuntimeException {
    public InvalidBookStateException(Long id) {
        super("The book with id %d cannot be deleted because it is not in a BAD state.".formatted(id));
    }
}
