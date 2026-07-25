package com.pagelens.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UrlValidatorTest {

    @Test
    void testValidHttpUrl() {
        assertTrue(UrlValidator.isValidHttpUrl("http://example.com"));
        assertTrue(UrlValidator.isValidHttpUrl("http://www.example.com/path?query=1"));
    }

    @Test
    void testValidHttpsUrl() {
        assertTrue(UrlValidator.isValidHttpUrl("https://example.com"));
        assertTrue(UrlValidator.isValidHttpUrl("https://sub.domain.example.co.uk"));
    }

    @Test
    void testBlankUrl() {
        assertFalse(UrlValidator.isValidHttpUrl(null));
        assertFalse(UrlValidator.isValidHttpUrl(""));
        assertFalse(UrlValidator.isValidHttpUrl("   "));
    }

    @Test
    void testInvalidSyntax() {
        assertFalse(UrlValidator.isValidHttpUrl("htp://typo.com"));
        assertFalse(UrlValidator.isValidHttpUrl("just-a-string"));
        assertFalse(UrlValidator.isValidHttpUrl("www.missing-protocol.com"));
    }

    @Test
    void testFtpRejection() {
        assertFalse(UrlValidator.isValidHttpUrl("ftp://files.example.com"));
    }

    @Test
    void testFileProtocolRejection() {
        assertFalse(UrlValidator.isValidHttpUrl("file:///C:/windows/system32/config"));
    }

    @Test
    void testMailtoRejection() {
        assertFalse(UrlValidator.isValidHttpUrl("mailto:test@example.com"));
    }

    @Test
    void testExcessivelyLongUrl() {
        StringBuilder longUrl = new StringBuilder("https://example.com/");
        for (int i = 0; i < 2050; i++) {
            longUrl.append("a");
        }
        assertFalse(UrlValidator.isValidHttpUrl(longUrl.toString()));
    }
}
