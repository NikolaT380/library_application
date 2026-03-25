package mk.ukim.finki.library_app.model.projection;

import mk.ukim.finki.library_app.model.domain.Category;
import mk.ukim.finki.library_app.model.domain.State;

public interface BookShortProjection {
    Long getId();
    String getName();
    Category getCategory();
    State getState();
    Integer getAvailableCopies();
}