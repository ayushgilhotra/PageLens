package com.pagelens.parser;

import com.pagelens.dto.HeadingInfo;
import com.pagelens.dto.ImageInfo;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class HtmlParserTest {

    private HtmlParser parser;

    @BeforeEach
    void setUp() {
        parser = new HtmlParser();
    }

    @Test
    void testExtractTitle() {
        Document doc = Jsoup.parse("<html><head><title>  Test Title  </title></head><body></body></html>");
        assertEquals("Test Title", parser.extractTitle(doc));
    }

    @Test
    void testExtractMetaDescription() {
        Document doc = Jsoup.parse("<html><head><meta name=\"description\" content=\"  Awesome page  \"></head><body></body></html>");
        assertEquals("Awesome page", parser.extractMetaDescription(doc));
    }

    @Test
    void testExtractHeadings() {
        Document doc = Jsoup.parse("<html><body><h1>Main</h1><h2>Sub1</h2><h2>Sub2</h2><h3>Detail</h3></body></html>");
        HeadingInfo info = parser.extractHeadings(doc);
        
        assertEquals("Main", info.getH1Text());
        assertEquals(1, info.getH1Count());
        assertEquals(2, info.getH2Count());
        assertEquals(1, info.getH3Count());
        assertEquals(0, info.getH4Count());
    }

    @Test
    void testCalculateWordCount() {
        String html = "<html><head><script>var x = 1;</script><style>.a {}</style></head>" +
                      "<body><p>This is a <b>test</b> of the word counter.</p></body></html>";
        Document doc = Jsoup.parse(html);
        
        int words = parser.calculateWordCount(doc);
        assertEquals(8, words); // "This is a test of the word counter."
    }

    @Test
    void testExtractImages() {
        String html = "<html><body><img src='1.jpg' alt='one'><img src='2.jpg' alt=''><img src='3.jpg'></body></html>";
        Document doc = Jsoup.parse(html);
        
        ImageInfo info = parser.extractImages(doc);
        assertEquals(3, info.getTotalImages());
        assertEquals(1, info.getImagesWithAlt()); // Only the first one has a non-empty alt
        assertEquals(2, info.getImagesMissingAlt());
    }

    @Test
    void testExtractViewportAndCharset() {
        String html = "<html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width'></head><body></body></html>";
        Document doc = Jsoup.parse(html);
        
        assertEquals("UTF-8", parser.extractCharset(doc));
        assertEquals("width=device-width", parser.extractViewport(doc));
    }

    @Test
    void testExtractLanguageAndRobots() {
        String html = "<html lang='en-US'><head><meta name='robots' content='index, follow'></head><body></body></html>";
        Document doc = Jsoup.parse(html);
        
        assertEquals("en-US", parser.extractLanguage(doc));
        assertEquals("index, follow", parser.extractRobots(doc));
    }

    @Test
    void testExtractFavicon() {
        String html = "<html><head><link rel='icon' href='https://example.com/favicon.ico'></head><body></body></html>";
        Document doc = Jsoup.parse(html, "https://example.com");
        
        assertEquals("https://example.com/favicon.ico", parser.extractFavicon(doc));
    }
}
