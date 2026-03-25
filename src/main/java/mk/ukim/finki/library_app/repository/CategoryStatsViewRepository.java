package mk.ukim.finki.library_app.repository;

import mk.ukim.finki.library_app.model.views.CategoryStatsView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CategoryStatsViewRepository extends JpaRepository<CategoryStatsView, String> {

    @Modifying
    @Transactional
    @Query(value = "REFRESH MATERIALIZED VIEW category_stats_materialized_view", nativeQuery = true)
    void refreshMaterializedView();

}
