package mk.ukim.finki.library_app.web.handler;

import mk.ukim.finki.library_app.model.exception.*;
import mk.ukim.finki.library_app.web.controller.AuthorController;
import mk.ukim.finki.library_app.web.controller.BookController;
import mk.ukim.finki.library_app.web.controller.CountryController;
import mk.ukim.finki.library_app.web.dto.ApiError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice(assignableTypes = {BookController.class, AuthorController.class, CountryController.class})
public class BookControllerExceptionHandler {


    @ExceptionHandler({AuthorNotFoundException.class, BookNotFoundException.class, CountryNotFoundException.class})
    public ResponseEntity<ApiError> handleNotFound(RuntimeException exception) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiError.of(HttpStatus.NOT_FOUND, exception.getMessage()));
    }


    @ExceptionHandler({InvalidBookStateException.class, NoAvailableCopiesException.class})
    public ResponseEntity<ApiError> handleBadRequest(RuntimeException exception) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiError.of(HttpStatus.BAD_REQUEST, exception.getMessage()));
    }

    @ExceptionHandler(BookInBadConditionException.class)
    public ResponseEntity<String> handleBookInBadConditionException(BookInBadConditionException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exception.getMessage());
    }

}
