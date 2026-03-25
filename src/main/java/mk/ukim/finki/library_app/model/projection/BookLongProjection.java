package mk.ukim.finki.library_app.model.projection;

import mk.ukim.finki.library_app.model.domain.Category;
import mk.ukim.finki.library_app.model.domain.State;
import org.springframework.beans.factory.annotation.Value;

public interface BookLongProjection {
    Long getId();
    String getName();
    Category getCategory();
    State getState();
    Integer getAvailableCopies();


    @Value("#{target.author.name + ' ' + target.author.surname}")
    String getAuthorFullName();


    @Value("#{target.author.country.name}")
    String getAuthorCountry();
}