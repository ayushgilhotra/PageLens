package com.pagelens.exception;

/**
 * Exception thrown when the application fails to connect to or download content from a website.
 */
public class WebsiteFetchException extends RuntimeException {
    
    public WebsiteFetchException(String message) {
        super(message);
    }
    
    public WebsiteFetchException(String message, Throwable cause) {
        super(message, cause);
    }
}
