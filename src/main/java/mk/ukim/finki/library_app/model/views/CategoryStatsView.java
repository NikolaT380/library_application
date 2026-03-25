package mk.ukim.finki.library_app.model.views;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.Immutable;

@Entity
@Data
@Immutable
@Table(name = "category_stats_materialized_view")
public class CategoryStatsView {

    @Id
    private String category;

    private Long totalBooks;

    private Long totalAvailableCopies;

    private Long booksInBadCondition;
}
