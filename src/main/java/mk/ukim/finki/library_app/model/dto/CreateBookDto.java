package mk.ukim.finki.library_app.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import mk.ukim.finki.library_app.model.domain.Author;
import mk.ukim.finki.library_app.model.domain.Book;
import mk.ukim.finki.library_app.model.domain.Category;

public record CreateBookDto(
        @NotBlank(message = "A name is required.")
        String name,

        @NotNull(message = "Category is required.")
        Category category,

        @NotNull(message = "Author is required.")
        Long authorId,

        @NotNull(message = "Available copies are required.")
        @Min(value = 1, message = "The book must have at least 1 copy.")
        Integer availableCopies
) {

    public Book toBook(Author author) {
        return new Book(name, category, author, availableCopies);
    }
}
