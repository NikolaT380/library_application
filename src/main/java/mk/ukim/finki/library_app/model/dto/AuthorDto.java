package mk.ukim.finki.library_app.model.dto;

import mk.ukim.finki.library_app.model.domain.Author;
import mk.ukim.finki.library_app.model.domain.Country;

public record AuthorDto(
        String name,
        String surname,
        Long countryId
) {
    public Author toAuthor(Country country) {
        return new Author(name, surname, country);
    }
}
