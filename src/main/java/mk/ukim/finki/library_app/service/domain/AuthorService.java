package mk.ukim.finki.library_app.service.domain;

import mk.ukim.finki.library_app.model.domain.Author;
import java.util.List;
import java.util.Optional;

public interface AuthorService {
    Optional<Author> findById(Long id);
    List<Author> findAll();
    Author create(Author author);
    Optional<Author> update(Long id, Author author);
    Optional<Author> deleteById(Long id);
}
