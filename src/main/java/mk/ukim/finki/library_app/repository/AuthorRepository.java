package mk.ukim.finki.library_app.repository;

import mk.ukim.finki.library_app.model.domain.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {
    boolean existsByCountryId(Long countryId);
    List<Author> findAllByOrderByIdAsc();
}
