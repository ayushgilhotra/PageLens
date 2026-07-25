package com.pagelens.util;

import com.pagelens.dto.HeadingInfo;
import com.pagelens.dto.ImageInfo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class SeoScoreCalculatorTest {

    private SeoScoreCalculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new SeoScoreCalculator();
    }

    @Test
    void testPerfectScore_Returns100AndAPlus() {
        HeadingInfo headings = new HeadingInfo("Title", 1, 2, 0, 0);
        ImageInfo images = new ImageInfo(10, 10, 0);

        SeoScoreCalculator.SeoEvaluationResult result = calculator.calculate(
                true, true, headings, images, 1000, true, true, true, true);

        assertEquals(100, result.totalScore());
        assertEquals("A+", result.grade());
        assertTrue(result.breakdown().isHttps());
        assertTrue(result.breakdown().isSingleH1());
    }

    @Test
    void testMultipleH1_PartialScore() {
        HeadingInfo headings = new HeadingInfo("Title", 2, 2, 0, 0);
        ImageInfo images = new ImageInfo(10, 10, 0);

        SeoScoreCalculator.SeoEvaluationResult result = calculator.calculate(
                true, true, headings, images, 1000, true, true, true, true);

        assertEquals(92, result.totalScore()); // 100 - 7 (lost half of 15 points, integer math drops .5)
        assertEquals("A", result.grade());
        assertFalse(result.breakdown().isSingleH1());
    }

    @Test
    void testZeroImages_FullImageScore() {
        HeadingInfo headings = new HeadingInfo("Title", 1, 2, 0, 0);
        ImageInfo images = new ImageInfo(0, 0, 0); // No images on page

        SeoScoreCalculator.SeoEvaluationResult result = calculator.calculate(
                true, true, headings, images, 1000, true, true, true, true);

        assertEquals(100, result.totalScore());
        assertTrue(result.breakdown().isImageAlt());
    }

    @Test
    void testPoorContentLength_LowScore() {
        HeadingInfo headings = new HeadingInfo("Title", 1, 2, 0, 0);
        ImageInfo images = new ImageInfo(10, 10, 0);

        SeoScoreCalculator.SeoEvaluationResult result = calculator.calculate(
                true, true, headings, images, 150, true, true, true, true);

        assertEquals(85, result.totalScore()); // Lost 15 points on content length
        assertEquals("B", result.grade());
        assertFalse(result.breakdown().isContentLength());
    }

    @Test
    void testGradeBoundaries() {
        HeadingInfo headings = new HeadingInfo("Title", 0, 0, 0, 0);
        ImageInfo images = new ImageInfo(10, 0, 10);
        
        // Terrible site
        SeoScoreCalculator.SeoEvaluationResult result = calculator.calculate(
                false, false, headings, images, 100, false, false, false, false);
                
        // Base score = 0 from booleans. Content length (100) -> 5 points. Image alt (0/10) -> 3 points. Total = 8.
        assertEquals(8, result.totalScore());
        assertEquals("F", result.grade());
    }
}
