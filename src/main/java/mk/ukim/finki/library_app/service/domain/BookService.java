package mk.ukim.finki.library_app.service.domain;

import mk.ukim.finki.library_app.model.domain.Book;

import java.util.List;
import java.util.Optional;

public interface BookService {
    Optional<Book> findById(Long id);

    List<Book> findAll();

    Book create(Book book);

    Optional<Book> update(Long id, Book book);

    Optional<Book> deleteById(Long id);

    Optional<Book> rent(Long id);

    List<Book> filterBooksById(Long a, Long b);
}
