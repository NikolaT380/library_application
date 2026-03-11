package mk.ukim.finki.library_app.web.controller;

import mk.ukim.finki.library_app.model.domain.Author;
import mk.ukim.finki.library_app.model.domain.Country;
import mk.ukim.finki.library_app.model.dto.AuthorDto;
import mk.ukim.finki.library_app.model.exception.CountryNotFoundException;
import mk.ukim.finki.library_app.service.domain.AuthorService;
import mk.ukim.finki.library_app.service.domain.CountryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/authors")
public class AuthorController {

    private final AuthorService authorService;
    private final CountryService countryService;

    public AuthorController(AuthorService authorService, CountryService countryService) {
        this.authorService = authorService;
        this.countryService = countryService;
    }

    @GetMapping
    public ResponseEntity<List<Author>> findAll() {
        return ResponseEntity.ok(authorService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Author> findById(@PathVariable Long id) {
        return authorService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<Author> create(@RequestBody AuthorDto authorDto) {
        Country country = countryService.findById(authorDto.countryId())
                .orElseThrow(() -> new CountryNotFoundException(authorDto.countryId()));

        return ResponseEntity.ok(authorService.create(authorDto.toAuthor(country)));
    }

    @PutMapping("/{id}/edit")
    public ResponseEntity<Author> update(@PathVariable Long id, @RequestBody AuthorDto authorDto) {
        Country country = countryService.findById(authorDto.countryId())
                .orElseThrow(() -> new CountryNotFoundException(authorDto.countryId()));

        return authorService.update(id, authorDto.toAuthor(country))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Author> deleteById(@PathVariable Long id) {
        return authorService.deleteById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
