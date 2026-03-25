package mk.ukim.finki.library_app.events;

import lombok.Getter;

@Getter
public class BookRentedEvent {

    private final Long bookId;
    private final String bookName;
    private final int remainingCopies;

    public BookRentedEvent(Long bookId, String bookName, int remainingCopies) {
        this.bookId = bookId;
        this.bookName = bookName;
        this.remainingCopies = remainingCopies;
    }
}
