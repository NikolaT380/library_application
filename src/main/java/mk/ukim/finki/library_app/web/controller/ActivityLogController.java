package mk.ukim.finki.library_app.web.controller;

import mk.ukim.finki.library_app.model.domain.ActivityLog;
import mk.ukim.finki.library_app.repository.ActivityLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/logs")
public class ActivityLogController {

    private final ActivityLogRepository logRepository;

    public ActivityLogController(ActivityLogRepository logRepository) {
        this.logRepository = logRepository;
    }
// this is for entire list down I change it to be pagination
//    @GetMapping
//    public ResponseEntity<List<ActivityLog>> getRecentLogs() {
//        List<ActivityLog> logs = logRepository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
//        return ResponseEntity.ok(logs);
//    }


    @GetMapping
    public ResponseEntity<Page<ActivityLog>> getLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        Page<ActivityLog> pagedLogs = logRepository.findAll(pageable);

        return ResponseEntity.ok(pagedLogs);
    }



    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearLogs() {
        logRepository.deleteAll();
        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLog(@PathVariable Long id) {
        logRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/delete-batch")
    public ResponseEntity<Void> deleteBatchLogs(@RequestBody List<Long> ids) {
        logRepository.deleteAllById(ids);
        return ResponseEntity.ok().build();
    }

}
