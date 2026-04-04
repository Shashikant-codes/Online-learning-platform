package com.learnhub.dto;

import lombok.Data;

@Data
public class CourseRequest {

    private String title;
    private String description;
    private String shortDescription;
    private Double price;

    // ✅ Frontend sends 'thumbnail' — support both names
    private String thumbnail;
    private String thumbnailUrl;

    private String videoUrl;
    private Integer duration;
    private String level;
    private String language;
    private Long categoryId;

    // ✅ Frontend sends 'published' — maps to 'active' in the entity
    private Boolean published;
}