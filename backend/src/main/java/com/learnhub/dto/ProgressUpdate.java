package com.learnhub.dto;

import lombok.Data;

@Data
public class ProgressUpdate {
    private Integer progressPercent;
    private Long lastLessonId;
}
