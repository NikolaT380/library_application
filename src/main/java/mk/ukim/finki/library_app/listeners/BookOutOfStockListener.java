package mk.ukim.finki.library_app.listeners;

import mk.ukim.finki.library_app.events.BookOutOfStockEvent;
import mk.ukim.finki.library_app.model.domain.ActivityLog;
import mk.ukim.finki.library_app.repository.ActivityLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
public class BookOutOfStockListener {

    private static final Logger log = LoggerFactory.getLogger(BookOutOfStockListener.class);
    private final ActivityLogRepository activityLogRepository;

    public BookOutOfStockListener(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @EventListener
    public void onBookOutOfStock(BookOutOfStockEvent event) {
        log.warn("🚨 ALERT: Book '{}' (ID: {}) is now OUT OF STOCK!", event.getBookName(), event.getBookId());

        ActivityLog outOfStockLog = new ActivityLog(
                "OUT OF STOCK",
                String.format("Alert: All copies of '%s' have been rented.", event.getBookName())
        );
        activityLogRepository.save(outOfStockLog);
    }
}
