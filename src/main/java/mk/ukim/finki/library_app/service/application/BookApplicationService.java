package mk.ukim.finki.library_app.service.application;

import mk.ukim.finki.library_app.model.dto.CreateBookDto;
import mk.ukim.finki.library_app.model.dto.DisplayBookDto;

import java.util.List;
import java.util.Optional;

public interface BookApplicationService {
    Optional<DisplayBookDto> findById(Long id);

    List<DisplayBookDto> findAll();

    DisplayBookDto create(CreateBookDto createBookDto);

    Optional<DisplayBookDto> update(Long id, CreateBookDto createBookDto);

    Optional<DisplayBookDto> deleteById(Long id);

    Optional<DisplayBookDto> rent(Long id);

    List<DisplayBookDto> filterBooksById(Long a, Long b);

}
