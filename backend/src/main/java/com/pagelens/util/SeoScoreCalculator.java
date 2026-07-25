package com.pagelens.util;

import com.pagelens.dto.HeadingInfo;
import com.pagelens.dto.ImageInfo;
import com.pagelens.dto.SeoBreakdown;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Deterministic SEO Scoring Engine.
 * Evaluates extracted website metadata against strict, explainable rules to produce
 * a reproducible SEO score, grade, and categorical breakdown.
 * Contains zero network or parsing logic.
 */
@Component
@Slf4j
public class SeoScoreCalculator {

    // Weight Distribution (Total: 100 points)
    private static final int WEIGHT_HTTPS = 10;
    private static final int WEIGHT_META_DESC = 15;
    private static final int WEIGHT_H1 = 15;
    private static final int WEIGHT_IMAGE_ALT = 15;
    private static final int WEIGHT_CONTENT_LENGTH = 20;
    private static final int WEIGHT_VIEWPORT = 10;
    private static final int WEIGHT_CHARSET = 5;
    private static final int WEIGHT_ROBOTS = 5;
    private static final int WEIGHT_SITEMAP = 5;

    /**
     * Container for the final evaluation results to avoid returning a massive map or modifying external DTOs directly.
     */
    public record SeoEvaluationResult(int totalScore, String grade, SeoBreakdown breakdown) {}

    /**
     * The primary evaluation method. Receives raw analysis data and executes the deterministic scoring pipeline.
     */
    public SeoEvaluationResult calculate(boolean isHttps, boolean hasMetaDescription, HeadingInfo headings, 
                                         ImageInfo images, int wordCount, boolean hasViewport, 
                                         boolean hasCharset, boolean hasRobots, boolean hasSitemap) {
        long startTime = System.currentTimeMillis();

        // 1. Calculate individual scores
        int httpsScore = calculateHttpsScore(isHttps);
        int metaDescScore = calculateMetaDescriptionScore(hasMetaDescription);
        int h1Score = calculateH1Score(headings.getH1Count());
        int imageAltScore = calculateImageAltScore(images.getTotalImages(), images.getImagesWithAlt());
        int contentLengthScore = calculateContentLengthScore(wordCount);
        int viewportScore = calculateViewportScore(hasViewport);
        int charsetScore = calculateCharsetScore(hasCharset);
        int robotsScore = calculateRobotsScore(hasRobots);
        int sitemapScore = calculateSitemapScore(hasSitemap);

        // 2. Aggregate Total Score
        int totalScore = httpsScore + metaDescScore + h1Score + imageAltScore + contentLengthScore +
                         viewportScore + charsetScore + robotsScore + sitemapScore;

        // Clamp score just in case (though math dictates it shouldn't exceed 100)
        totalScore = Math.max(0, Math.min(100, totalScore));

        // 3. Calculate Grade
        String grade = calculateGrade(totalScore);

        // 4. Populate Breakdown (Determines if the criterion "passed" from a UI perspective)
        SeoBreakdown breakdown = SeoBreakdown.builder()
                .https(isHttps)
                .metaDescription(hasMetaDescription)
                .singleH1(headings.getH1Count() == 1)
                .imageAlt(imageAltScore == WEIGHT_IMAGE_ALT) // Full points means it passed the check
                .contentLength(wordCount >= 300)             // 300+ is considered a pass for UI breakdown
                .viewport(hasViewport)
                .charset(hasCharset)
                .robots(hasRobots)
                .sitemap(hasSitemap)
                .build();

        long executionTime = System.currentTimeMillis() - startTime;
        log.info("SEO Evaluation complete in {}ms. Total Score: {}/100, Grade: {}", executionTime, totalScore, grade);

        return new SeoEvaluationResult(totalScore, grade, breakdown);
    }

    private int calculateHttpsScore(boolean isHttps) {
        return isHttps ? WEIGHT_HTTPS : 0;
    }

    private int calculateMetaDescriptionScore(boolean hasMetaDescription) {
        return hasMetaDescription ? WEIGHT_META_DESC : 0;
    }

    /**
     * H1 Logic: Exactly 1 H1 gets full points. Multiple H1s get a partial score. 0 H1s get 0 points.
     */
    private int calculateH1Score(int h1Count) {
        if (h1Count == 1) {
            return WEIGHT_H1;
        } else if (h1Count > 1) {
            return (int) (WEIGHT_H1 * 0.5); // 50% partial score for multiple H1s
        }
        return 0;
    }

    /**
     * Image Alt Logic: Evaluates the percentage of images containing alt text.
     */
    private int calculateImageAltScore(int totalImages, int imagesWithAlt) {
        if (totalImages == 0) {
            return WEIGHT_IMAGE_ALT; // No penalty for having no images
        }

        double coverage = (double) imagesWithAlt / totalImages;
        
        if (coverage == 1.0) {
            return WEIGHT_IMAGE_ALT;
        } else if (coverage >= 0.75) {
            return (int) (WEIGHT_IMAGE_ALT * 0.75); // High partial score
        } else if (coverage >= 0.50) {
            return (int) (WEIGHT_IMAGE_ALT * 0.50); // Moderate partial score
        }
        return (int) (WEIGHT_IMAGE_ALT * 0.25);     // Low partial score
    }

    /**
     * Content Length Logic: Evaluates visible word count thresholds.
     */
    private int calculateContentLengthScore(int wordCount) {
        if (wordCount > 800) {
            return WEIGHT_CONTENT_LENGTH;
        } else if (wordCount >= 300) {
            return (int) (WEIGHT_CONTENT_LENGTH * 0.75); // Moderate score (15/20)
        }
        return (int) (WEIGHT_CONTENT_LENGTH * 0.25);     // Low score (5/20) for thin content
    }

    private int calculateViewportScore(boolean hasViewport) {
        return hasViewport ? WEIGHT_VIEWPORT : 0;
    }

    private int calculateCharsetScore(boolean hasCharset) {
        return hasCharset ? WEIGHT_CHARSET : 0;
    }

    private int calculateRobotsScore(boolean hasRobots) {
        return hasRobots ? WEIGHT_ROBOTS : 0;
    }

    private int calculateSitemapScore(boolean hasSitemap) {
        return hasSitemap ? WEIGHT_SITEMAP : 0;
    }

    /**
     * Maps the final numeric score to a strict letter grade.
     */
    private String calculateGrade(int score) {
        if (score >= 95) return "A+";
        if (score >= 90) return "A";
        if (score >= 80) return "B";
        if (score >= 70) return "C";
        if (score >= 60) return "D";
        return "F";
    }
}
