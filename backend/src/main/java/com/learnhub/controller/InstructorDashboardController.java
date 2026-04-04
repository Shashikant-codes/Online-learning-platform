package com.learnhub.controller;
import com.learnhub.model.Course;
import com.learnhub.model.User;
import com.learnhub.service.CategoryService;
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
@RequestMapping("/api/instructor")
@CrossOrigin(origins = "*")
public class InstructorDashboardController {
    @Autowired
    private CourseService courseService;
    @Autowired
    private UserService userService;
    @Autowired
    private EnrollmentService enrollmentService;
    @Autowired
    private CategoryService categoryService;
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(Authentication authentication) {
        String email = authentication.getName();
        User instructor = userService.findByEmail(email);

        List<Course> courses = courseService.getCoursesByInstructorId(instructor.getId());

        int totalStudents = courses.stream()
                .mapToInt(Course::getEnrolledCount)
                .sum();

        double totalRevenue = courses.stream()
                .mapToDouble(c -> c.getPrice() * c.getEnrolledCount())
                .sum();

        int totalLessons = courses.stream()
                .mapToInt(c -> c.getLessons() != null ? c.getLessons().size() : 0)
                .sum();

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalCourses", courses.size());
        dashboard.put("totalStudents", totalStudents);
        dashboard.put("totalRevenue", totalRevenue);
        dashboard.put("totalLessons", totalLessons);
        dashboard.put("courses", courses);

        return ResponseEntity.ok(dashboard);
    }
    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getMyCourses(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(courseService.getCoursesByInstructor(email));
    }
    @GetMapping("/courses/{courseId}/students")
    public ResponseEntity<?> getCourseStudents(
            @PathVariable Long courseId,
            Authentication authentication) {
        String email = authentication.getName();
        Course course = courseService.getCourseById(courseId);

        // Verify ownership
        if (!course.getInstructor().getEmail().equals(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Not authorized"));
        }

        return ResponseEntity.ok(enrollmentService.getCourseEnrollments(courseId));
    }
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(Authentication authentication) {
        String email = authentication.getName();
        User instructor = userService.findByEmail(email);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCourses", courseService.getTotalCourses(instructor.getId()));
        stats.put("totalStudents", courseService.getTotalEnrolledStudents(instructor.getId()));
        stats.put("totalRevenue", courseService.getTotalRevenue(instructor.getId()));
        stats.put("totalLessons", courseService.getTotalLessons(instructor.getId()));

        return ResponseEntity.ok(stats);
    }
}