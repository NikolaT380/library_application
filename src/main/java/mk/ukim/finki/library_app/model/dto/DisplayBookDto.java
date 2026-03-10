package mk.ukim.finki.library_app.model.dto;

import java.util.List;
import mk.ukim.finki.library_app.model.domain.Book;
import mk.ukim.finki.library_app.model.domain.Category;
import mk.ukim.finki.library_app.model.domain.State;

public record DisplayBookDto(
        Long id,
        String name,
        Category category,
        Long authorId,
        String authorName,
        State state,
        Integer availableCopies
) {
    public static DisplayBookDto from(Book book) {
        return new DisplayBookDto(
                book.getId(),
                book.getName(),
                book.getCategory(),
                book.getAuthor() != null ? book.getAuthor().getId() : null,
                book.getAuthor() != null ? book.getAuthor().getName() + " " + book.getAuthor().getSurname() : "Unknown",
                book.getState(),
                book.getAvailableCopies()
        );
    }

    public static List<DisplayBookDto> from(List<Book> books) {
        return books
                .stream()
                .map(DisplayBookDto::from)
                .toList();
    }
}
