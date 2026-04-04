package com.learnhub.controller;

import com.learnhub.dto.LessonRequest;
import com.learnhub.model.Lesson;
import com.learnhub.service.LessonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "*")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    // ✅ Public GET for course lessons — students & instructors both need this
    // Auth is handled at service level (videoUrl is stripped for unenrolled users via CourseController)
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Lesson>> getLessonsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(lessonService.getLessonsByCourse(courseId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lesson> getLessonById(@PathVariable Long id) {
        return ResponseEntity.ok(lessonService.getLessonById(id));
    }

    // ✅ Protected — only instructors can create lessons
    @PostMapping
    public ResponseEntity<Lesson> createLesson(
            @Valid @RequestBody LessonRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        Lesson lesson = lessonService.createLesson(request, email);
        return ResponseEntity.ok(lesson);
    }

    // ✅ Protected — only the course instructor can update lessons
    @PutMapping("/{id}")
    public ResponseEntity<Lesson> updateLesson(
            @PathVariable Long id,
            @Valid @RequestBody LessonRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        Lesson lesson = lessonService.updateLesson(id, request, email);
        return ResponseEntity.ok(lesson);
    }

    // ✅ Protected — only the course instructor can delete lessons
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        lessonService.deleteLesson(id, email);
        return ResponseEntity.ok().build();
    }

    // ✅ Protected — only instructor can update video URL
    @PatchMapping("/{id}/video")
    public ResponseEntity<Lesson> updateVideoUrl(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        String videoUrl = body.get("videoUrl");
        String email = authentication.getName();
        Lesson lesson = lessonService.updateVideoUrl(id, videoUrl, email);
        return ResponseEntity.ok(lesson);
    }

    // ✅ Access check — works for both authenticated and unauthenticated users
    @GetMapping("/{id}/access")
    public ResponseEntity<Map<String, Boolean>> checkLessonAccess(
            @PathVariable Long id,
            Authentication authentication) {
        Map<String, Boolean> access = new HashMap<>();
        if (authentication != null) {
            try {
                Lesson lesson = lessonService.getLessonById(id);
                String email = authentication.getName();
                if (lesson.getCourse().getInstructor().getEmail().equals(email)) {
                    access.put("hasAccess", true);
                    return ResponseEntity.ok(access);
                }
            } catch (Exception e) {
                // Fall through
            }
        }
        access.put("hasAccess", false);
        return ResponseEntity.ok(access);
    }
}