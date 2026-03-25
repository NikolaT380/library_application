package mk.ukim.finki.library_app.model.exception;

public class AuthorHasBooksException extends RuntimeException {
  public AuthorHasBooksException(Long id) {
    super("Cannot delete author with id %d because there are books associated with them.".formatted(id));
  }
}
