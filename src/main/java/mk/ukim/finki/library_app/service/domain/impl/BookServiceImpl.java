package mk.ukim.finki.library_app.service.domain.impl;

import mk.ukim.finki.library_app.model.domain.Book;
import mk.ukim.finki.library_app.model.domain.State;
import mk.ukim.finki.library_app.model.exception.NoAvailableCopiesException;
import mk.ukim.finki.library_app.model.exception.InvalidBookStateException;
import mk.ukim.finki.library_app.repository.BookRepository;
import mk.ukim.finki.library_app.service.domain.BookService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public Optional<Book> findById(Long id) {
        return bookRepository.findById(id);
    }

    @Override
    public List<Book> findAll() {
        return bookRepository.findAll();
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

            if (book.getAvailableCopies() <= 0) {
                throw new NoAvailableCopiesException(id);
            }
            book.setAvailableCopies(book.getAvailableCopies() - 1);
            return bookRepository.save(book);
        });
    }
}
