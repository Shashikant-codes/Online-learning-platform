package com.learnhub.controller;

import com.learnhub.dto.ProgressRequest;
import com.learnhub.model.Enrollment;
import com.learnhub.service.CourseService;
import com.learnhub.service.EnrollmentService;
import com.learnhub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "*")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserService userService;

    // ✅ FIXED: Now accepts courseId as a PATH VARIABLE — matches frontend call:
    //    POST /api/enrollments/{courseId}
    @PostMapping("/{courseId}")
    public ResponseEntity<?> enrollInCourse(
            @PathVariable Long courseId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            Enrollment enrollment = enrollmentService.enrollStudent(courseId, email);
            courseService.incrementEnrolledCount(courseId);
            return ResponseEntity.ok(enrollment);
        } catch (RuntimeException e) {
            // Handle "already enrolled" gracefully instead of 500
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // ✅ KEPT: Original body-based enroll still works (backward compat)
    @PostMapping
    public ResponseEntity<?> enrollInCourseByBody(
            @RequestBody ProgressRequest request,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            Enrollment enrollment = enrollmentService.enrollStudent(request.getCourseId(), email);
            courseService.incrementEnrolledCount(request.getCourseId());
            return ResponseEntity.ok(enrollment);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<Enrollment>> getMyEnrollments(Authentication authentication) {
        String email = authentication.getName();
        var user = userService.findByEmail(email);
        return ResponseEntity.ok(enrollmentService.getUserEnrollments(user.getId()));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Enrollment>> getCourseEnrollments(@PathVariable Long courseId) {
        return ResponseEntity.ok(enrollmentService.getCourseEnrollments(courseId));
    }

    @GetMapping("/check/{courseId}")
    public ResponseEntity<Map<String, Boolean>> checkEnrollment(
            @PathVariable Long courseId,
            Authentication authentication) {
        String email = authentication.getName();
        boolean enrolled = enrollmentService.isEnrolled(email, courseId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("enrolled", enrolled);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/progress")
    public ResponseEntity<?> updateProgress(
            @RequestBody ProgressRequest request,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            var user = userService.findByEmail(email);
            Enrollment enrollment = enrollmentService.updateProgress(
                    user.getId(),
                    request.getCourseId(),
                    request.getProgress()
            );
            return ResponseEntity.ok(enrollment);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{courseId}/progress")
    public ResponseEntity<Map<String, Object>> getProgress(
            @PathVariable Long courseId,
            Authentication authentication) {
        String email = authentication.getName();
        var user = userService.findByEmail(email);
        var enrollment = enrollmentService.getEnrollment(user.getId(), courseId);

        Map<String, Object> response = new HashMap<>();
        if (enrollment.isPresent()) {
            response.put("progress", enrollment.get().getProgress());
            response.put("completed", enrollment.get().isCompleted());
            response.put("enrolled", true);
        } else {
            response.put("progress", 0.0);
            response.put("completed", false);
            response.put("enrolled", false);
        }
        return ResponseEntity.ok(response);
    }
}