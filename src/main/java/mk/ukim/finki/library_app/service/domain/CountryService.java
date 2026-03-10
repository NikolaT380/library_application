package mk.ukim.finki.library_app.service.domain;

import mk.ukim.finki.library_app.model.domain.Country;

import java.util.List;
import java.util.Optional;

public interface CountryService {
    Optional<Country> findById(Long id);

    List<Country> findAll();
}
