package com.pagelens.exception;

/**
 * Exception thrown when a URL provided by the user fails validation rules.
 */
public class InvalidUrlException extends RuntimeException {
    
    public InvalidUrlException(String message) {
        super(message);
    }
    
}
