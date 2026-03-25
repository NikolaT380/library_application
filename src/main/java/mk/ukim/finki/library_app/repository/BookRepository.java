package mk.ukim.finki.library_app.repository;

import mk.ukim.finki.library_app.model.domain.Book;
import mk.ukim.finki.library_app.model.projection.BookLongProjection;
import mk.ukim.finki.library_app.model.projection.BookShortProjection;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book>{
    boolean existsByAuthorId(Long authorId);
    List<Book> findAllByOrderByIdAsc();
    List<Book> findAllByIdBetween(Long a, Long b);

    List<BookShortProjection> findAllProjectedBy();
    List<BookLongProjection> findAllLongProjectedBy();

    @EntityGraph(attributePaths = {"author", "author.country"})
    List<Book> findAllOptimizedBy();
}
