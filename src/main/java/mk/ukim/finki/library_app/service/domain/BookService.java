package mk.ukim.finki.library_app.service.domain;

import mk.ukim.finki.library_app.model.domain.Book;

import java.util.List;
import java.util.Optional;

import mk.ukim.finki.library_app.model.projection.BookLongProjection;
import mk.ukim.finki.library_app.model.projection.BookShortProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import mk.ukim.finki.library_app.model.domain.Category;
import mk.ukim.finki.library_app.model.domain.State;

public interface BookService {
    Optional<Book> findById(Long id);

    List<Book> findAll();

    Book create(Book book);

    Optional<Book> update(Long id, Book book);

    Optional<Book> deleteById(Long id);

    Optional<Book> rent(Long id);

    List<Book> filterBooksById(Long a, Long b);

    Page<Book> searchAndFilterBooks(Category category, State state, Long authorId, Boolean hasAvailable, Pageable pageable);

    List<BookShortProjection> findAllShortProjections();
    List<BookLongProjection> findAllLongProjections();

    List<Book> findAllOptimized();
}
