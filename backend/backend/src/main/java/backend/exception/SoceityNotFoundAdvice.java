package backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

public class SoceityNotFoundAdvice {
    @ExceptionHandler(SoceityNotFoundException.class)
    public ResponseEntity<String> handleSocietyException(SoceityNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception ex) {
        return new ResponseEntity<>("Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
