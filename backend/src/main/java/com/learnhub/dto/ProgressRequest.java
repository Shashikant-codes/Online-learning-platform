package com.learnhub.dto;
import lombok.Data;
@Data
public class ProgressRequest {
    private Long courseId;
    private Double progress;
}