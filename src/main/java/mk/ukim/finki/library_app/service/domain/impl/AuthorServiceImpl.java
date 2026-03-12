package mk.ukim.finki.library_app.service.domain.impl;

import mk.ukim.finki.library_app.model.domain.Author;
import mk.ukim.finki.library_app.repository.AuthorRepository;
import mk.ukim.finki.library_app.repository.BookRepository;
import mk.ukim.finki.library_app.service.domain.AuthorService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;

    public AuthorServiceImpl(AuthorRepository authorRepository, BookRepository bookRepository) {
        this.authorRepository = authorRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public Optional<Author> findById(Long id) {
        return authorRepository.findById(id);
    }

    @Override
    public List<Author> findAll() {
        return authorRepository.findAllByOrderByIdAsc();
    }

    @Override
    public Author create(Author author) {
        return authorRepository.save(author);
    }

    @Override
    public Optional<Author> update(Long id, Author author) {
        return authorRepository.findById(id).map(existingAuthor -> {
            existingAuthor.setName(author.getName());
            existingAuthor.setSurname(author.getSurname());
            existingAuthor.setCountry(author.getCountry());
            return authorRepository.save(existingAuthor);
        });
    }

    @Override
    public Optional<Author> deleteById(Long id) {


        if (bookRepository.existsByAuthorId(id)) {
            throw new RuntimeException("Cannot delete author because there are books associated with them.");
        }

        Optional<Author> author = authorRepository.findById(id);
        author.ifPresent(authorRepository::delete);
        return author;
    }
}
