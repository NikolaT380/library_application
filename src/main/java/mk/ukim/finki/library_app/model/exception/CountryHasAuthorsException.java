package mk.ukim.finki.library_app.model.exception;

public class CountryHasAuthorsException extends RuntimeException {
    public CountryHasAuthorsException(Long id) {
        super("Cannot delete country with id %d because it has associated authors.".formatted(id));
    }
}
