package mk.ukim.finki.library_app.model.exception;

public class NoAvailableCopiesException extends RuntimeException {
    public NoAvailableCopiesException(Long id) {
        super("The book with id %d has no available copies for rent.".formatted(id));
    }
}
