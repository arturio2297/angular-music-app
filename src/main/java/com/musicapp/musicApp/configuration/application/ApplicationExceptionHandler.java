package com.musicapp.musicApp.configuration.application;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.message.error.ErrorCode;
import com.musicapp.musicApp.core.message.error.ErrorResponse;
import com.musicapp.musicApp.core.message.error.ErrorResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
@Slf4j
public class ApplicationExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ApplicationException.class)
    protected ResponseEntity<ErrorResponse> handleApplicationException(ApplicationException exception) {
        final int code = exception.getCode();

        switch (code) {
            case ErrorCode.NOT_FOUND:
                return ResponseEntity.notFound().build();
            case ErrorCode.FORBIDDEN:
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        final ErrorResponse response = ErrorResponses.get(code);
        return ResponseEntity.badRequest().body(response);
    }

}
