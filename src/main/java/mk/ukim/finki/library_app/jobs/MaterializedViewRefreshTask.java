package mk.ukim.finki.library_app.jobs;

import mk.ukim.finki.library_app.repository.CategoryStatsViewRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class MaterializedViewRefreshTask {


    private static final Logger log = LoggerFactory.getLogger(MaterializedViewRefreshTask.class);

    private final CategoryStatsViewRepository repository;

    public MaterializedViewRefreshTask(CategoryStatsViewRepository repository) {
        this.repository = repository;
    }


    @Scheduled(fixedRateString = "${app.refresh.view.interval:30000}")
    public void refreshView() {

        log.info("Scheduled Task Started: Refreshing materialized view 'category_stats_materialized_view'...");


        repository.refreshMaterializedView();


        log.info("Scheduled Task Finished: Materialized view refreshed successfully.");
    }
}
