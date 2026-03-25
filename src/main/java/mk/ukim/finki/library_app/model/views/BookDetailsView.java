package mk.ukim.finki.library_app.model.views;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.Immutable;

@Entity
@Data
@Immutable
@Table(name = "book_details_view")
public class BookDetailsView {

    @Id
    private Long bookId;

    private String bookName;

    private String bookCategory;

    private String bookState;

    private Integer availableCopies;

    private String authorFullName;

    private String countryName;
}
