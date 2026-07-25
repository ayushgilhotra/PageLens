package com.pagelens.exception;

import com.pagelens.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Centralized exception handler for the entire application.
 * Catches all exceptions and formats them into a predictable ErrorResponse DTO.
 * Prevents stack traces or internal errors from leaking to the frontend.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles DTO validation failures (e.g., @NotBlank, @Pattern).
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String errorMessage = "Validation failed";
        FieldError fieldError = ex.getBindingResult().getFieldError();
        if (fieldError != null) {
            errorMessage = fieldError.getDefaultMessage();
        }

        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Bad Request")
                .message(errorMessage)
                .path(request.getRequestURI())
                .build();
    }

    /**
     * Handles specific URL syntax failures.
     */
    @ExceptionHandler(InvalidUrlException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleInvalidUrlException(InvalidUrlException ex, HttpServletRequest request) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Invalid URL")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
    }

    /**
     * Handles timeouts during website connection or fetching.
     */
    @ExceptionHandler(TimeoutException.class)
    @ResponseStatus(HttpStatus.GATEWAY_TIMEOUT)
    public ErrorResponse handleTimeoutException(TimeoutException ex, HttpServletRequest request) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.GATEWAY_TIMEOUT.value())
                .error("Gateway Timeout")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
    }

    /**
     * Handles failures fetching the website (e.g., DNS, 404, 500 from the target).
     */
    @ExceptionHandler(WebsiteFetchException.class)
    @ResponseStatus(HttpStatus.BAD_GATEWAY)
    public ErrorResponse handleWebsiteFetchException(WebsiteFetchException ex, HttpServletRequest request) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_GATEWAY.value())
                .error("Bad Gateway")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
    }

    /**
     * Handles cases where the target URL does not return HTML (e.g., an image or PDF).
     */
    @ExceptionHandler(NonHtmlContentException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorResponse handleNonHtmlContentException(NonHtmlContentException ex, HttpServletRequest request) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.UNPROCESSABLE_ENTITY.value())
                .error("Unprocessable Entity")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
    }

    /**
     * Handles any unexpected errors during the analysis process.
     */
    @ExceptionHandler(AnalysisException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleAnalysisException(AnalysisException ex, HttpServletRequest request) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Internal Server Error")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
    }

    /**
     * Fallback handler for all other unhandled exceptions.
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGenericException(Exception ex, HttpServletRequest request) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Internal Server Error")
                .message("An unexpected error occurred.")
                .path(request.getRequestURI())
                .build();
    }
}
