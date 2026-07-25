package com.pagelens.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents the breakdown of individual SEO criteria passes or failures.
 * This is used to explain how the overall SEO score was calculated.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeoBreakdown {
    
    private boolean https;
    private boolean metaDescription;
    private boolean singleH1;
    private boolean imageAlt;
    private boolean contentLength;
    private boolean viewport;
    private boolean charset;
    private boolean robots;
    private boolean sitemap;

}
