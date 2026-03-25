package mk.ukim.finki.library_app.service.application;

import mk.ukim.finki.library_app.model.domain.Category;
import mk.ukim.finki.library_app.model.domain.State;
import mk.ukim.finki.library_app.model.dto.CreateBookDto;
import mk.ukim.finki.library_app.model.dto.DisplayBookDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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

    Page<DisplayBookDto> searchAndFilterBooks(Category category, State state, Long authorId, Boolean hasAvailable, Pageable pageable);
}
