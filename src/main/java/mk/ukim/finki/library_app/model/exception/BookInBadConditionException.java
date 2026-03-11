package mk.ukim.finki.library_app.model.exception;

public class BookInBadConditionException extends RuntimeException {

    public BookInBadConditionException(Long id) {
        super(String.format("Book with id: %d is in BAD condition and cannot be rented!!", id));
    }
}
