package com.pagelens.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents image analysis statistics, focusing heavily on accessibility (alt texts).
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageInfo {
    
    private int totalImages;
    private int imagesWithAlt;
    private int imagesMissingAlt;

}
