package com.pagelens.service;

import com.pagelens.dto.AnalyzeRequest;
import com.pagelens.dto.AnalyzeResponse;
import com.pagelens.dto.HeadingInfo;
import com.pagelens.dto.ImageInfo;
import com.pagelens.dto.SeoBreakdown;
import com.pagelens.exception.AnalysisException;
import com.pagelens.exception.InvalidUrlException;
import com.pagelens.exception.NonHtmlContentException;
import com.pagelens.exception.TimeoutException;
import com.pagelens.exception.WebsiteFetchException;
import com.pagelens.parser.HtmlParser;
import com.pagelens.util.AppConstants;
import com.pagelens.util.SeoScoreCalculator;
import com.pagelens.util.UrlValidator;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.SocketTimeoutException;
import java.net.URI;
import java.net.URL;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

/**
 * Core orchestration service for the Website Intelligence Platform.
 * Coordinates networking, fetching, parsing, and DTO construction.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyzeService {

    private final HtmlParser htmlParser;
    private final SeoScoreCalculator seoScoreCalculator;

    /**
     * Performs the complete analysis workflow for a given URL.
     *
     * @param request The validated request containing the target URL.
     * @return The populated AnalyzeResponse containing all extracted intelligence.
     */
    public AnalyzeResponse analyze(AnalyzeRequest request) {
        String targetUrl = request.getUrl();
        log.info("Starting analysis for URL: {}", targetUrl);

        if (!UrlValidator.isValidHttpUrl(targetUrl)) {
            log.warn("Invalid URL format detected by service layer: {}", targetUrl);
            throw new InvalidUrlException("Invalid URL format. Must be HTTP or HTTPS.");
        }

        long startTime = System.currentTimeMillis();
        Connection.Response response = fetchWebpage(targetUrl);
        long responseTime = System.currentTimeMillis() - startTime;

        verifyHtmlContent(response);

        try {
            Document doc = response.parse();
            return buildResponse(targetUrl, response, doc, responseTime);
        } catch (IOException e) {
            log.error("Failed to parse document for URL: {}", targetUrl, e);
            throw new AnalysisException("Failed to parse the website structure.", e);
        }
    }

    /**
     * Executes the HTTP connection using realistic browser headers to prevent blocking.
     */
    private Connection.Response fetchWebpage(String url) {
        try {
            return Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .header("Accept-Language", "en-US,en;q=0.9")
                    .timeout(AppConstants.DEFAULT_TIMEOUT_MS)
                    .followRedirects(true)
                    .ignoreHttpErrors(true) // We want to parse 404s/500s if they return HTML
                    .execute();
        } catch (SocketTimeoutException e) {
            log.error("Timeout fetching URL: {}", url);
            throw new TimeoutException("The website took too long to respond.", e);
        } catch (IOException e) {
            log.error("Failed to fetch URL: {}", url, e);
            throw new WebsiteFetchException("Failed to connect to the website.", e);
        }
    }

    /**
     * Ensures the downloaded payload is actually an HTML document.
     */
    private void verifyHtmlContent(Connection.Response response) {
        String contentType = response.contentType();
        if (contentType == null || !contentType.toLowerCase().contains("text/html")) {
            throw new NonHtmlContentException("The provided URL does not point to an HTML webpage.");
        }
    }

    /**
     * Constructs the final response DTO using data from the parser and networking layer.
     */
    private AnalyzeResponse buildResponse(String url, Connection.Response response, Document doc, long responseTime) {
        String domain = extractDomain(url);
        boolean isHttps = url.toLowerCase().startsWith(AppConstants.PROTOCOL_HTTPS);
        boolean hasSitemap = checkSitemap(domain, isHttps);
        
        HeadingInfo headings = htmlParser.extractHeadings(doc);
        ImageInfo images = htmlParser.extractImages(doc);
        
        String title = htmlParser.extractTitle(doc);
        String metaDescription = htmlParser.extractMetaDescription(doc);
        String viewport = htmlParser.extractViewport(doc);
        String charset = htmlParser.extractCharset(doc);
        String robots = htmlParser.extractRobots(doc);
        
        boolean hasMetaDescription = !metaDescription.isEmpty();
        boolean hasViewport = !viewport.isEmpty();
        boolean hasCharset = !charset.isEmpty();
        boolean hasRobots = !robots.isEmpty();
        int wordCount = htmlParser.calculateWordCount(doc);

        SeoScoreCalculator.SeoEvaluationResult seoResult = seoScoreCalculator.calculate(
                isHttps,
                hasMetaDescription,
                headings,
                images,
                wordCount,
                hasViewport,
                hasCharset,
                hasRobots,
                hasSitemap
        );

        log.info("Successfully completed analysis for URL: {}", url);

        return AnalyzeResponse.builder()
                .url(url)
                .domain(domain)
                .analyzedAt(LocalDateTime.now())
                .httpStatus(response.statusCode())
                .responseTime(responseTime)
                .pageTitle(title)
                .metaDescription(metaDescription)
                .favicon(htmlParser.extractFavicon(doc))
                .charset(charset)
                .language(htmlParser.extractLanguage(doc))
                .wordCount(wordCount)
                .sslEnabled(isHttps)
                .viewportAvailable(hasViewport)
                .robotsTxtFound(hasRobots)
                .sitemapFound(hasSitemap)
                .seoScore(seoResult.totalScore())
                .seoGrade(seoResult.grade())
                .headings(headings)
                .images(images)
                .seoBreakdown(seoResult.breakdown())
                .build();
    }

    /**
     * Safely extracts the domain name from a full URL.
     */
    private String extractDomain(String urlString) {
        try {
            URI uri = new URI(urlString);
            String domain = uri.getHost();
            return domain != null ? domain.startsWith("www.") ? domain.substring(4) : domain : "";
        } catch (Exception e) {
            log.warn("Failed to extract domain from URL: {}", urlString);
            return "";
        }
    }

    /**
     * Performs a lightweight HEAD request to check if a sitemap.xml exists.
     */
    private boolean checkSitemap(String domain, boolean isHttps) {
        if (domain.isEmpty()) return false;
        
        String protocol = isHttps ? AppConstants.PROTOCOL_HTTPS : AppConstants.PROTOCOL_HTTP;
        String sitemapUrl = protocol + domain + "/sitemap.xml";
        
        try {
            URL url = new URL(sitemapUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("HEAD");
            connection.setConnectTimeout(3000);
            connection.setReadTimeout(3000);
            
            int responseCode = connection.getResponseCode();
            return responseCode >= 200 && responseCode < 400;
        } catch (IOException e) {
            log.debug("Sitemap check failed for domain: {}", domain);
            return false;
        }
    }
}
