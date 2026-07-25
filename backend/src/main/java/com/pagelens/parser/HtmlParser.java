package com.pagelens.parser;

import com.pagelens.dto.HeadingInfo;
import com.pagelens.dto.ImageInfo;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

/**
 * Pure DOM extraction parser.
 * Responsibilities are strictly limited to querying the parsed Jsoup Document.
 * Performs no networking and throws no network-related exceptions.
 */
@Component
public class HtmlParser {

    /**
     * Extracts the page title.
     *
     * @param doc The parsed Jsoup Document
     * @return The trimmed title, or empty string if not found
     */
    public String extractTitle(Document doc) {
        String title = doc.title();
        return title != null ? title.trim() : "";
    }

    /**
     * Extracts the meta description.
     *
     * @param doc The parsed Jsoup Document
     * @return The description content, or empty string if not found
     */
    public String extractMetaDescription(Document doc) {
        Element metaDesc = doc.selectFirst("meta[name=description]");
        if (metaDesc != null && metaDesc.hasAttr("content")) {
            return metaDesc.attr("content").trim();
        }
        return "";
    }

    /**
     * Extracts heading statistics and the primary H1 text.
     *
     * @param doc The parsed Jsoup Document
     * @return A populated HeadingInfo DTO
     */
    public HeadingInfo extractHeadings(Document doc) {
        Elements h1s = doc.select("h1");
        Elements h2s = doc.select("h2");
        Elements h3s = doc.select("h3");
        Elements h4s = doc.select("h4");

        String primaryH1Text = "";
        if (!h1s.isEmpty()) {
            primaryH1Text = h1s.first().text().trim();
        }

        return HeadingInfo.builder()
                .h1Count(h1s.size())
                .h1Text(primaryH1Text)
                .h2Count(h2s.size())
                .h3Count(h3s.size())
                .h4Count(h4s.size())
                .build();
    }

    /**
     * Extracts image statistics, evaluating the presence of alt attributes.
     *
     * @param doc The parsed Jsoup Document
     * @return A populated ImageInfo DTO
     */
    public ImageInfo extractImages(Document doc) {
        Elements images = doc.select("img");
        int total = images.size();
        int withAlt = 0;
        int missingAlt = 0;

        for (Element img : images) {
            String alt = img.attr("alt");
            // If the attribute exists but is empty, it's considered decorative (valid accessibility practice in some cases)
            // However, the prompt implies "Images Missing Alt" refers to the attribute itself.
            if (img.hasAttr("alt") && !alt.trim().isEmpty()) {
                withAlt++;
            } else {
                missingAlt++;
            }
        }

        return ImageInfo.builder()
                .totalImages(total)
                .imagesWithAlt(withAlt)
                .imagesMissingAlt(missingAlt)
                .build();
    }

    /**
     * Calculates the visible word count of the page, ignoring scripts and styles.
     *
     * @param doc The parsed Jsoup Document
     * @return The approximate number of visible words
     */
    public int calculateWordCount(Document doc) {
        // Clone to avoid modifying the original document passed in
        Document clone = doc.clone();
        
        // Remove non-visible elements
        clone.select("script, style, noscript, meta, title").remove();
        
        String text = clone.body() != null ? clone.body().text() : clone.text();
        if (text == null || text.trim().isEmpty()) {
            return 0;
        }
        
        // Split by whitespace to count words
        String[] words = text.trim().split("\\s+");
        return words.length;
    }

    /**
     * Attempts to find a valid favicon URL from standard link tags.
     *
     * @param doc The parsed Jsoup Document
     * @return The favicon URL, or empty string if none found
     */
    public String extractFavicon(Document doc) {
        Element icon = doc.selectFirst("link[rel=icon], link[rel=shortcut icon], link[rel=apple-touch-icon]");
        if (icon != null && icon.hasAttr("href")) {
            return icon.attr("abs:href"); // Returns absolute URL if possible
        }
        return "";
    }

    /**
     * Extracts the language defined in the HTML tag.
     *
     * @param doc The parsed Jsoup Document
     * @return The language code, or empty string
     */
    public String extractLanguage(Document doc) {
        Element html = doc.selectFirst("html");
        if (html != null && html.hasAttr("lang")) {
            return html.attr("lang").trim();
        }
        return "";
    }

    /**
     * Extracts the character set defined in the meta tags.
     *
     * @param doc The parsed Jsoup Document
     * @return The charset, or empty string
     */
    public String extractCharset(Document doc) {
        Element metaCharset = doc.selectFirst("meta[charset]");
        if (metaCharset != null && metaCharset.hasAttr("charset")) {
            return metaCharset.attr("charset").trim();
        }
        
        // Fallback for older HTML4 style charset
        Element contentType = doc.selectFirst("meta[http-equiv=Content-Type]");
        if (contentType != null && contentType.hasAttr("content")) {
            String content = contentType.attr("content");
            if (content.toLowerCase().contains("charset=")) {
                return content.substring(content.toLowerCase().indexOf("charset=") + 8).trim();
            }
        }
        return "";
    }

    /**
     * Extracts the viewport configuration.
     *
     * @param doc The parsed Jsoup Document
     * @return The viewport content, or empty string
     */
    public String extractViewport(Document doc) {
        Element viewport = doc.selectFirst("meta[name=viewport]");
        if (viewport != null && viewport.hasAttr("content")) {
            return viewport.attr("content").trim();
        }
        return "";
    }

    /**
     * Extracts the robots meta tag content.
     *
     * @param doc The parsed Jsoup Document
     * @return The robots directive, or empty string
     */
    public String extractRobots(Document doc) {
        Element robots = doc.selectFirst("meta[name=robots]");
        if (robots != null && robots.hasAttr("content")) {
            return robots.attr("content").trim();
        }
        return "";
    }
}
