package mk.ukim.finki.library_app.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import mk.ukim.finki.library_app.model.domain.BooksViewMode;

@Data
@AllArgsConstructor
public class BooksViewModeResponse {
    private BooksViewMode booksViewMode;
}