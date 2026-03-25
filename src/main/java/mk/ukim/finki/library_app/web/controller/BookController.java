package mk.ukim.finki.library_app.web.controller;

import jakarta.validation.Valid;
import java.util.List;

import mk.ukim.finki.library_app.model.domain.Book;
import mk.ukim.finki.library_app.model.views.BookDetailsView;
import mk.ukim.finki.library_app.model.dto.CreateBookDto;
import mk.ukim.finki.library_app.model.dto.DisplayBookDto;
import mk.ukim.finki.library_app.model.projection.BookLongProjection;
import mk.ukim.finki.library_app.model.projection.BookShortProjection;
import mk.ukim.finki.library_app.repository.BookDetailsViewRepository;
import mk.ukim.finki.library_app.service.application.BookApplicationService;
import mk.ukim.finki.library_app.service.domain.BookService;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import mk.ukim.finki.library_app.model.domain.Category;
import mk.ukim.finki.library_app.model.domain.State;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookApplicationService bookApplicationService;
    private final BookService bookService;
    private final BookDetailsViewRepository viewRepository;

    public BookController(BookApplicationService bookApplicationService, BookService bookService, BookDetailsViewRepository viewRepository) {
        this.bookApplicationService = bookApplicationService;
        this.bookService = bookService;
        this.viewRepository = viewRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayBookDto> findById(@PathVariable Long id) {
        return bookApplicationService
                .findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<DisplayBookDto>> findAll() {
        return ResponseEntity.ok(bookApplicationService.findAll());
    }

    @PostMapping("/add")
    public ResponseEntity<DisplayBookDto> create(@RequestBody @Valid CreateBookDto createBookDto) {
        return ResponseEntity.ok(bookApplicationService.create(createBookDto));
    }

    @PutMapping("/{id}/edit")
    public ResponseEntity<DisplayBookDto> update(
            @PathVariable Long id,
            @RequestBody CreateBookDto createBookDto
    ) {
        return bookApplicationService
                .update(id, createBookDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<DisplayBookDto> deleteById(@PathVariable Long id) {
        return bookApplicationService
                .deleteById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @PostMapping("/{id}/rent")
    public ResponseEntity<DisplayBookDto> rentBook(@PathVariable Long id) {
        return bookApplicationService
                .rent(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/filter")
    public List<DisplayBookDto> filterBooks(@RequestParam Long a, @RequestParam Long b) {
        return bookApplicationService.filterBooksById(a, b);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<DisplayBookDto>> searchBooks(
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) State state,
            @RequestParam(required = false) Long authorId,
            @RequestParam(required = false) Boolean hasAvailable,
            @ParameterObject @PageableDefault(size = 10, page = 0, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {

        Page<DisplayBookDto> result = bookApplicationService.searchAndFilterBooks(category, state, authorId, hasAvailable, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/projections/short")
    public ResponseEntity<List<BookShortProjection>> getShortProjections() {
        return ResponseEntity.ok(bookService.findAllShortProjections());
    }

    @GetMapping("/projections/long")
    public ResponseEntity<List<BookLongProjection>> getLongProjections() {
        return ResponseEntity.ok(bookService.findAllLongProjections());
    }

    @GetMapping("/optimized")
    public ResponseEntity<List<DisplayBookDto>> findAllOptimized() {

        List<Book> optimizedBooksEntity = bookService.findAllOptimized();
        List<DisplayBookDto> responseDto = DisplayBookDto.from(optimizedBooksEntity);

        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/view")
    public ResponseEntity<List<BookDetailsView>> getBooksFromView() {

        return ResponseEntity.ok(viewRepository.findAll());
    }
}
