package com.learnhub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private BigDecimal price;
    private String instructorName;
    private Long instructorId;
    private LocalDateTime createdAt;
    private int totalLessons;
    private int totalDurationSeconds;
    private List<LessonResponse> lessons;
    private boolean enrolled;
    private Integer progressPercent;
}
