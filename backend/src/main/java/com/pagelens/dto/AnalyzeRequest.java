package com.pagelens.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents the incoming request to analyze a website URL.
 * Contains strict Jakarta Validation rules to ensure the URL is syntactically valid
 * before any processing begins.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyzeRequest {

    /**
     * The URL to be analyzed. Must be a valid HTTP or HTTPS address.
     */
    @NotBlank(message = "URL cannot be blank.")
    @Size(max = 2048, message = "URL exceeds maximum supported length.")
    @Pattern(regexp = "^(https?://).*$", message = "Please enter a valid HTTP or HTTPS URL.")
    private String url;

    /**
     * Trims whitespace from the URL before returning it, if necessary.
     * While DTOs shouldn't have complex logic, a basic getter override for sanitation
     * is a standard practice to prevent trailing space issues.
     * 
     * @return The trimmed URL.
     */
    public String getUrl() {
        return url != null ? url.trim() : null;
    }
}
