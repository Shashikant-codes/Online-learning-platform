package com.learnhub.service;

import com.learnhub.dto.CourseRequest;
import com.learnhub.model.Category;
import com.learnhub.model.Course;
import com.learnhub.model.User;
import com.learnhub.repository.CategoryRepository;
import com.learnhub.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserService userService;

    public Course createCourse(CourseRequest request, String instructorEmail) {
        User instructor = userService.findByEmail(instructorEmail);

        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setShortDescription(request.getShortDescription());
        course.setPrice(request.getPrice() != null ? request.getPrice() : 0.0);
        course.setThumbnailUrl(request.getThumbnailUrl() != null ? request.getThumbnailUrl()
                : request.getThumbnail());
        course.setVideoUrl(request.getVideoUrl());
        course.setDuration(request.getDuration());
        course.setLevel(request.getLevel());
        course.setLanguage(request.getLanguage() != null ? request.getLanguage() : "English");
        course.setInstructor(instructor);

        // ✅ FIX: active = true ALWAYS (means course exists, not deleted)
        // active is only set to false when a course is soft-deleted by admin
        course.setActive(true);

        course.setEnrolledCount(0);
        course.setRating(0.0);
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());

        if (request.getCategoryId() != null) {
            Optional<Category> category = categoryRepository.findById(request.getCategoryId());
            category.ifPresent(course::setCategory);
        }

        return courseRepository.save(course);
    }

    public Course updateCourse(Long courseId, CourseRequest request, String instructorEmail) {
        Course course = getCourseEntityById(courseId);
        User instructor = userService.findByEmail(instructorEmail);

        if (!course.getInstructor().getId().equals(instructor.getId())) {
            throw new RuntimeException("You don't have permission to update this course");
        }

        if (request.getTitle() != null) course.setTitle(request.getTitle());
        if (request.getDescription() != null) course.setDescription(request.getDescription());
        if (request.getShortDescription() != null) course.setShortDescription(request.getShortDescription());
        if (request.getPrice() != null) course.setPrice(request.getPrice());

        if (request.getThumbnailUrl() != null) course.setThumbnailUrl(request.getThumbnailUrl());
        else if (request.getThumbnail() != null) course.setThumbnailUrl(request.getThumbnail());

        if (request.getVideoUrl() != null) course.setVideoUrl(request.getVideoUrl());
        if (request.getDuration() != null) course.setDuration(request.getDuration());
        if (request.getLevel() != null) course.setLevel(request.getLevel());
        if (request.getLanguage() != null) course.setLanguage(request.getLanguage());

        // ✅ FIX: NEVER change active based on published toggle
        // active = true means course exists (only admin soft-deletes set it to false)
        // We keep active = true always here — do NOT touch it from published field
        course.setActive(true);

        if (request.getCategoryId() != null) {
            Optional<Category> category = categoryRepository.findById(request.getCategoryId());
            category.ifPresent(course::setCategory);
        }

        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
    }

    public Course getCourseEntityById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Course> getActiveCourses() {
        return courseRepository.findByActiveTrue();
    }

    public List<Course> getCoursesByInstructor(String instructorEmail) {
        User instructor = userService.findByEmail(instructorEmail);
        return courseRepository.findByInstructor(instructor);
    }

    public List<Course> getCoursesByInstructorId(Long instructorId) {
        return courseRepository.findByInstructorId(instructorId);
    }

    public List<Course> getEnrolledCourses(Long userId) {
        return courseRepository.findEnrolledCoursesByUserId(userId);
    }

    public List<Course> getCoursesByCategory(Long categoryId) {
        return courseRepository.findByCategoryIdAndActiveTrue(categoryId);
    }

    public List<Course> searchCourses(String keyword) {
        return courseRepository.searchByTitleOrDescription(keyword);
    }

    public List<Course> getPopularCourses(int limit) {
        return courseRepository.findPopularCourses(limit);
    }

    public List<Course> getRecentCourses(int limit) {
        return courseRepository.findRecentCourses(limit);
    }

    public void deleteCourse(Long courseId, String instructorEmail) {
        Course course = getCourseEntityById(courseId);
        User instructor = userService.findByEmail(instructorEmail);
        if (!course.getInstructor().getId().equals(instructor.getId())) {
            throw new RuntimeException("You don't have permission to delete this course");
        }
        courseRepository.delete(course);
    }

    public Course activateCourse(Long courseId, String instructorEmail) {
        Course course = getCourseEntityById(courseId);
        User instructor = userService.findByEmail(instructorEmail);
        if (!course.getInstructor().getId().equals(instructor.getId())) {
            throw new RuntimeException("You don't have permission to update this course");
        }
        course.setActive(true);
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    public Course deactivateCourse(Long courseId, String instructorEmail) {
        Course course = getCourseEntityById(courseId);
        User instructor = userService.findByEmail(instructorEmail);
        if (!course.getInstructor().getId().equals(instructor.getId())) {
            throw new RuntimeException("You don't have permission to update this course");
        }
        // ✅ Only admin/explicit deactivation should set active=false
        // This is a soft delete — course won't appear in public listings
        course.setActive(false);
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    public void incrementEnrolledCount(Long courseId) {
        Course course = getCourseEntityById(courseId);
        course.setEnrolledCount(course.getEnrolledCount() + 1);
        courseRepository.save(course);
    }

    public int getTotalEnrolledStudents(Long instructorId) {
        return getCoursesByInstructorId(instructorId).stream()
                .mapToInt(Course::getEnrolledCount)
                .sum();
    }

    public double getTotalRevenue(Long instructorId) {
        return getCoursesByInstructorId(instructorId).stream()
                .mapToDouble(c -> c.getPrice() * c.getEnrolledCount())
                .sum();
    }

    public int getTotalCourses(Long instructorId) {
        return getCoursesByInstructorId(instructorId).size();
    }

    public int getTotalLessons(Long instructorId) {
        return getCoursesByInstructorId(instructorId).stream()
                .mapToInt(c -> c.getLessons() != null ? c.getLessons().size() : 0)
                .sum();
    }

    public Long getUserIdByEmail(String email) {
        User user = userService.findByEmail(email);
        return user.getId();
    }

    public Map<String, Object> getInstructorDashboard(String instructorEmail) {
        User instructor = userService.findByEmail(instructorEmail);
        List<Course> courses = courseRepository.findByInstructor(instructor);

        int totalStudents = courses.stream().mapToInt(Course::getEnrolledCount).sum();
        double totalRevenue = courses.stream()
                .mapToDouble(c -> c.getPrice() * c.getEnrolledCount())
                .sum();
        int totalLessons = courses.stream()
                .mapToInt(c -> c.getLessons() != null ? c.getLessons().size() : 0)
                .sum();

        List<Map<String, Object>> courseStats = new ArrayList<>();
        for (Course c : courses) {
            Map<String, Object> stat = new HashMap<>();
            stat.put("id", c.getId());
            stat.put("title", c.getTitle());
            stat.put("published", c.isActive());
            stat.put("price", c.getPrice());
            stat.put("enrolledStudents", c.getEnrolledCount());
            stat.put("lessonsCount", c.getLessons() != null ? c.getLessons().size() : 0);
            courseStats.add(stat);
        }

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalCourses", courses.size());
        dashboard.put("totalLessons", totalLessons);
        dashboard.put("totalStudents", totalStudents);
        dashboard.put("totalRevenue", totalRevenue);
        dashboard.put("courses", courseStats);
        return dashboard;
    }
}