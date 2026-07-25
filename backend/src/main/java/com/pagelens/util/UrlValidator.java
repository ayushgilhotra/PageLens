package com.pagelens.util;

import java.net.MalformedURLException;
import java.net.URL;

/**
 * Centralized utility for strict URL validation.
 * Ensures the application only attempts to process safe and valid HTTP/HTTPS URLs.
 */
public final class UrlValidator {

    private UrlValidator() {
        // Prevent instantiation
    }

    /**
     * Validates if the provided string is a well-formed HTTP or HTTPS URL.
     * Rejects FTP, MAILTO, FILE, or malformed inputs.
     * 
     * @param urlString The string to validate.
     * @return true if valid and supported, false otherwise.
     */
    public static boolean isValidHttpUrl(String urlString) {
        if (urlString == null || urlString.trim().isEmpty()) {
            return false;
        }
        
        if (urlString.length() > AppConstants.MAX_URL_LENGTH) {
            return false;
        }

        try {
            URL url = new URL(urlString);
            String protocol = url.getProtocol();
            
            return "http".equalsIgnoreCase(protocol) || "https".equalsIgnoreCase(protocol);
        } catch (MalformedURLException e) {
            return false;
        }
    }
}
