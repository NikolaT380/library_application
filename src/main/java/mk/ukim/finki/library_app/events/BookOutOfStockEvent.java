package mk.ukim.finki.library_app.events;

import org.springframework.context.ApplicationEvent;

public class BookOutOfStockEvent extends ApplicationEvent {

    private final Long bookId;
    private final String bookName;

    public BookOutOfStockEvent(Object source, Long bookId, String bookName) {
        super(source);
        this.bookId = bookId;
        this.bookName = bookName;
    }

    public Long getBookId() {
        return bookId;
    }

    public String getBookName() {
        return bookName;
    }
}
