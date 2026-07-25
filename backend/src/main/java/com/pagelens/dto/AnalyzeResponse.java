package com.pagelens.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * The primary API response representing a complete website analysis.
 * Contains all extracted metadata, SEO metrics, and performance data.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyzeResponse {

    private String url;
    private String domain;
    private LocalDateTime analyzedAt;
    
    // Performance & Network
    private int httpStatus;
    private long responseTime;
    
    // Metadata
    private String pageTitle;
    private String metaDescription;
    private String favicon;
    private String charset;
    private String language;
    private int wordCount;
    
    // Technical SEO
    private boolean sslEnabled;
    private boolean viewportAvailable;
    private boolean robotsTxtFound;
    private boolean sitemapFound;
    
    // Calculated Scores
    private int seoScore;
    private String seoGrade;
    
    // Nested Breakdowns
    private HeadingInfo headings;
    private ImageInfo images;
    private SeoBreakdown seoBreakdown;
}
