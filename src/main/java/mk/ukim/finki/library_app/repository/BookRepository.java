package mk.ukim.finki.library_app.repository;

import mk.ukim.finki.library_app.model.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    boolean existsByAuthorId(Long authorId);
    List<Book> findAllByOrderByIdAsc();
    List<Book> findAllByIdBetween(Long a, Long b);
}
