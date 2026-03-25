package mk.ukim.finki.library_app.web.controller;

import mk.ukim.finki.library_app.model.views.CategoryStatsView;
import mk.ukim.finki.library_app.repository.CategoryStatsViewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final CategoryStatsViewRepository statsRepository;

    public StatsController(CategoryStatsViewRepository statsRepository) {
        this.statsRepository = statsRepository;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryStatsView>> getCategoryStatistics() {
        return ResponseEntity.ok(statsRepository.findAll());
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> refreshStatistics() {
        statsRepository.refreshMaterializedView();
        return ResponseEntity.ok().build();
    }
}
