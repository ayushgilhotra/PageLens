package com.pagelens.exception;

/**
 * Exception thrown when the fetched content is not HTML (e.g., an image, PDF, or binary file).
 */
public class NonHtmlContentException extends RuntimeException {
    
    public NonHtmlContentException(String message) {
        super(message);
    }
    
}
