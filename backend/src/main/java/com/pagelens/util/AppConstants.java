package com.pagelens.util;

/**
 * Global application constants.
 * Prevents magic strings and magic numbers throughout the application.
 */
public final class AppConstants {

    private AppConstants() {
        // Prevent instantiation
    }

    public static final String API_V1_ANALYZE = "/api/v1/analyze";
    
    public static final int MAX_URL_LENGTH = 2048;
    public static final int DEFAULT_TIMEOUT_MS = 10000;
    
    public static final String PROTOCOL_HTTP = "http://";
    public static final String PROTOCOL_HTTPS = "https://";

}
