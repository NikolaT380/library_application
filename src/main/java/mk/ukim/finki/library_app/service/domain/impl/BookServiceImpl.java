package mk.ukim.finki.library_app.service.domain.impl;

import mk.ukim.finki.library_app.events.BookOutOfStockEvent;
import mk.ukim.finki.library_app.events.BookRentedEvent;
import mk.ukim.finki.library_app.model.domain.Book;
import mk.ukim.finki.library_app.model.domain.State;
import mk.ukim.finki.library_app.model.exception.BookInBadConditionException;
import mk.ukim.finki.library_app.model.exception.NoAvailableCopiesException;
import mk.ukim.finki.library_app.model.exception.InvalidBookStateException;
import mk.ukim.finki.library_app.model.projection.BookLongProjection;
import mk.ukim.finki.library_app.model.projection.BookShortProjection;
import mk.ukim.finki.library_app.repository.BookRepository;
import mk.ukim.finki.library_app.service.domain.BookService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import mk.ukim.finki.library_app.model.domain.Category;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final ApplicationEventPublisher eventPublisher;

    public BookServiceImpl(BookRepository bookRepository, ApplicationEventPublisher eventPublisher) {
        this.bookRepository = bookRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public Optional<Book> findById(Long id) {
        return bookRepository.findById(id);
    }

    @Override
    public List<Book> findAll() {
        return bookRepository.findAllByOrderByIdAsc();
    }

    @Override
    public Book create(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public Optional<Book> update(Long id, Book book) {
        return bookRepository.findById(id)
                .map(existingBook -> {
                    existingBook.setName(book.getName());
                    existingBook.setCategory(book.getCategory());
                    existingBook.setAuthor(book.getAuthor());
                    existingBook.setAvailableCopies(book.getAvailableCopies());
                    if (book.getState() != null) {
                        existingBook.setState(book.getState());
                    }
                    return bookRepository.save(existingBook);
                });
    }

    @Override
    public Optional<Book> deleteById(Long id) {
        return bookRepository.findById(id).map(book -> {

            if (book.getState() == State.GOOD) {
                throw new InvalidBookStateException(id);
            }
            bookRepository.delete(book);
            return book;
        });
    }

    @Override
    public Optional<Book> rent(Long id) {
        return bookRepository.findById(id).map(book -> {

            if (book.getState() == State.BAD) {
                throw new BookInBadConditionException(id);
            }

            if (book.getAvailableCopies() <= 0) {
                throw new NoAvailableCopiesException(id);
            }

            book.setAvailableCopies(book.getAvailableCopies() - 1);
            Book savedBook = bookRepository.save(book);

            eventPublisher.publishEvent(new BookRentedEvent(
                    savedBook.getId(),
                    savedBook.getName(),
                    savedBook.getAvailableCopies()
            ));

            if (savedBook.getAvailableCopies() == 0) {
                eventPublisher.publishEvent(new BookOutOfStockEvent(this, savedBook.getId(), savedBook.getName()));
            }

            return savedBook;
        });
    }


    @Override
    public List<Book> filterBooksById(Long a, Long b) {
        return bookRepository.findAllByIdBetween(a, b);
    }

    @Override
    public Page<Book> searchAndFilterBooks(String name, Category category, State state, Long authorId, Boolean hasAvailable, Pageable pageable) {

        Specification<Book> spec = (root, query, cb) -> cb.conjunction();
        //Specification<Book> spec = Specification.where((Specification<Book>) null);

        if (category != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category"), category));
        }

        if (state != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("state"), state));
        }

        if (authorId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("author").get("id"), authorId));
        }

        if (hasAvailable != null) {
            if (hasAvailable) {
                spec = spec.and((root, query, cb) -> cb.greaterThan(root.get("availableCopies"), 0));
            } else {
                spec = spec.and((root, query, cb) -> cb.equal(root.get("availableCopies"), 0));
            }
        }

        if (name != null && !name.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        }

        return bookRepository.findAll(spec, pageable);
    }

    @Override
    public List<BookShortProjection> findAllShortProjections() {
        return bookRepository.findAllProjectedBy();
    }

    @Override
    public List<BookLongProjection> findAllLongProjections() {
        return bookRepository.findAllLongProjectedBy();
    }

    @Override
    public List<Book> findAllOptimized() {
        return bookRepository.findAllOptimizedBy();
    }
}
