package mk.ukim.finki.library_app.listeners;

import mk.ukim.finki.library_app.model.domain.ActivityLog;
import mk.ukim.finki.library_app.events.BookRentedEvent;
import mk.ukim.finki.library_app.repository.ActivityLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
public class BookRentedEventListener {

    private static final Logger log = LoggerFactory.getLogger(BookRentedEventListener.class);
    private final ActivityLogRepository activityLogRepository;

    public BookRentedEventListener(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }


    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @EventListener
    public void onBookRented(BookRentedEvent event) {

        log.info("EVENT TRIGGERED: Book '{}' (ID: {}) was successfully rented. Remaining copies: {}",
                event.getBookName(), event.getBookId(), event.getRemainingCopies());

        ActivityLog logEntry = new ActivityLog(
                "BOOK_RENTED",
                String.format("Book '%s' rented. Remaining: %d", event.getBookName(), event.getRemainingCopies())
        );
        activityLogRepository.save(logEntry);
    }
}
