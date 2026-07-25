package com.pagelens.service;

import com.pagelens.dto.AnalyzeRequest;
import com.pagelens.exception.InvalidUrlException;
import com.pagelens.parser.HtmlParser;
import com.pagelens.util.SeoScoreCalculator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class AnalyzeServiceTest {

    @Mock
    private HtmlParser htmlParser;

    @Mock
    private SeoScoreCalculator seoScoreCalculator;

    @InjectMocks
    private AnalyzeService analyzeService;

    @BeforeEach
    void setUp() {
        // Mockito initializes mocks via annotations
    }

    @Test
    void testAnalyze_InvalidUrlThrowsException() {
        AnalyzeRequest request = new AnalyzeRequest("not-a-url");
        assertThrows(InvalidUrlException.class, () -> analyzeService.analyze(request));
    }

    @Test
    void testAnalyze_EmptyUrlThrowsException() {
        AnalyzeRequest request = new AnalyzeRequest("");
        assertThrows(InvalidUrlException.class, () -> analyzeService.analyze(request));
    }

    // Note: To deeply test successful fetch/parse, we would need to mock Jsoup's static methods
    // (e.g., using Mockito-inline) or abstract the fetcher. Given the constraint to not heavily refactor
    // the architecture, testing the explicit exception throw for invalid URLs is a clean, reliable test.
}
