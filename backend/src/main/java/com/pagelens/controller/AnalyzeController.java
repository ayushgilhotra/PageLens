package com.pagelens.controller;

import com.pagelens.dto.AnalyzeRequest;
import com.pagelens.dto.AnalyzeResponse;
import com.pagelens.service.AnalyzeService;
import com.pagelens.util.AppConstants;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller exposing the Website Intelligence analysis endpoint.
 * Kept intentionally thin, delegating all coordination to the AnalyzeService.
 */
@RestController
@RequestMapping(AppConstants.API_V1_ANALYZE)
@RequiredArgsConstructor
public class AnalyzeController {

    private final AnalyzeService analyzeService;

    /**
     * Receives a URL request, triggers the analysis pipeline, and returns the intelligence payload.
     *
     * @param request The incoming JSON body containing the URL to analyze, validated by Jakarta Validation.
     * @return The populated AnalyzeResponse payload.
     */
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AnalyzeResponse> analyzeWebsite(@Valid @RequestBody AnalyzeRequest request) {
        AnalyzeResponse response = analyzeService.analyze(request);
        return ResponseEntity.ok(response);
    }
}
