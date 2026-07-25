package com.pagelens.exception;

/**
 * Exception thrown when a connection or read operation exceeds the configured timeout limits.
 */
public class TimeoutException extends RuntimeException {
    
    public TimeoutException(String message) {
        super(message);
    }
    
    public TimeoutException(String message, Throwable cause) {
        super(message, cause);
    }
}
