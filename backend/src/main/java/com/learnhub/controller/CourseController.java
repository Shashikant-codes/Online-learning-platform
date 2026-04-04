package com.learnhub.controller;

import com.learnhub.dto.CourseRequest;
import com.learnhub.model.Course;
import com.learnhub.model.Lesson;
import com.learnhub.service.CategoryService;
import com.learnhub.service.CourseService;
import com.learnhub.service.EnrollmentService;
import com.learnhub.service.LessonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private LessonService lessonService;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getActiveCourses());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Course>> getAllCoursesAdmin() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<Map<String, Object>> getCourseDetails(
            @PathVariable Long id,
            Authentication authentication) {

        Map<String, Object> response = new HashMap<>();
        Course course = courseService.getCourseById(id);
        List<Lesson> allLessons = lessonService.getLessonsByCourse(id);

        boolean isOwner = false;
        boolean isEnrolled = false;

        if (authentication != null) {
            String email = authentication.getName();
            isOwner = course.getInstructor() != null &&
                    course.getInstructor().getEmail().equals(email);

            if (!isOwner) {
                try {
                    Long userId = courseService.getUserIdByEmail(email);
                    isEnrolled = enrollmentService.isUserEnrolled(userId, id);
                } catch (Exception e) {
                    isEnrolled = false;
                }
            }
        }

        // Strip videoUrl from lessons for unenrolled/unauthenticated users
        boolean hasAccess = isOwner || isEnrolled;
        List<Map<String, Object>> lessonData = new ArrayList<>();
        for (Lesson lesson : allLessons) {
            Map<String, Object> lessonMap = new HashMap<>();
            lessonMap.put("id", lesson.getId());
            lessonMap.put("title", lesson.getTitle());
            lessonMap.put("description", lesson.getDescription());
            lessonMap.put("duration", lesson.getDuration());
            lessonMap.put("orderIndex", lesson.getOrderIndex());
            lessonMap.put("videoUrl", hasAccess ? lesson.getVideoUrl() : null);
            lessonData.add(lessonMap);
        }

        response.put("course", course);
        response.put("lessons", lessonData);
        response.put("isOwner", isOwner);
        response.put("isEnrolled", isEnrolled);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(
            @Valid @RequestBody CourseRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        Course course = courseService.createCourse(request, email);
        return ResponseEntity.ok(course);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        Course course = courseService.updateCourse(id, request, email);
        return ResponseEntity.ok(course);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        courseService.deleteCourse(id, email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my-courses")
    public ResponseEntity<List<Course>> getMyCourses(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(courseService.getCoursesByInstructor(email));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Course>> getCoursesByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(courseService.getCoursesByCategory(categoryId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam String keyword) {
        return ResponseEntity.ok(courseService.searchCourses(keyword));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Course>> getPopularCourses(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(courseService.getPopularCourses(limit));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Course>> getRecentCourses(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(courseService.getRecentCourses(limit));
    }

    @GetMapping("/{id}/enrollment-status")
    public ResponseEntity<Map<String, Object>> getEnrollmentStatus(
            @PathVariable Long id,
            Authentication authentication) {
        Map<String, Object> status = new HashMap<>();
        if (authentication != null) {
            try {
                Long userId = courseService.getUserIdByEmail(authentication.getName());
                boolean enrolled = enrollmentService.isUserEnrolled(userId, id);
                status.put("enrolled", enrolled);
            } catch (Exception e) {
                status.put("enrolled", false);
            }
        } else {
            status.put("enrolled", false);
        }
        return ResponseEntity.ok(status);
    }

    @GetMapping("/instructor/dashboard")
    public ResponseEntity<Map<String, Object>> getInstructorDashboard(Authentication authentication) {
        String email = authentication.getName();
        Map<String, Object> dashboard = courseService.getInstructorDashboard(email);
        return ResponseEntity.ok(dashboard);
    }
}