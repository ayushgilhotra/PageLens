package com.pagelens.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents heading statistics for the analyzed page.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeadingInfo {
    
    private String h1Text;
    private int h1Count;
    private int h2Count;
    private int h3Count;
    private int h4Count;

}
