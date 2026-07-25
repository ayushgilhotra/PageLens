package com.pagelens.exception;

/**
 * Exception thrown when an unexpected error occurs during the parsing or SEO calculation phase.
 */
public class AnalysisException extends RuntimeException {
    
    public AnalysisException(String message) {
        super(message);
    }
    
    public AnalysisException(String message, Throwable cause) {
        super(message, cause);
    }
}
