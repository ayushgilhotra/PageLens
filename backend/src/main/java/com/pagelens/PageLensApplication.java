package com.pagelens;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the PageLens backend application.
 * Initializes the Spring Boot context.
 */
@SpringBootApplication
public class PageLensApplication {

    public static void main(String[] args) {
        SpringApplication.run(PageLensApplication.class, args);
    }

}
