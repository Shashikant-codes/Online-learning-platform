package com.learnhub.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class InstructorDashboardDTO {
    private Long instructorId;
    private String instructorName;
    private int totalCourses;
    private int totalLessons;
    private int totalStudents;
    private int totalRevenue;
    private List<CourseWithStatsDTO> courses;
    
    @Data
    public static class CourseWithStatsDTO {
        private Long id;
        private String title;
        private String thumbnail;
        private Double price;
        private Boolean published;
        private int enrolledStudents;
        private int lessonsCount;
        private LocalDateTime createdAt;
    }
}
