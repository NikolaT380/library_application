package mk.ukim.finki.library_app.repository;

import mk.ukim.finki.library_app.model.views.BookDetailsView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookDetailsViewRepository extends JpaRepository<BookDetailsView, Long> {

}
