package mk.ukim.finki.library_app.web.dto;

import lombok.Data;
import mk.ukim.finki.library_app.model.domain.BooksViewMode;

@Data
public class BooksViewModeRequest {
    private BooksViewMode booksViewMode;
}