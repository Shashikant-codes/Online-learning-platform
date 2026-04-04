package com.learnhub.service;
import com.learnhub.dto.LessonRequest;
import com.learnhub.model.Course;
import com.learnhub.model.Lesson;
import com.learnhub.model.User;
import com.learnhub.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@Service
@Transactional
public class LessonService {
    @Autowired
    private LessonRepository lessonRepository;
    @Autowired
    private CourseService courseService;
    @Autowired
    private UserService userService;
    public Lesson createLesson(LessonRequest request, String instructorEmail) {
        Course course = courseService.getCourseEntityById(request.getCourseId());
        User instructor = userService.findByEmail(instructorEmail);
        // Check ownership
        if (!course.getInstructor().getId().equals(instructor.getId())) {
            throw new RuntimeException("You don't have permission to add lessons to this course");
        }
        Lesson lesson = new Lesson();
        lesson.setTitle(request.getTitle());
        lesson.setDescription(request.getDescription());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setDuration(request.getDuration());
        lesson.setOrderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : 0);
        lesson.setCourse(course);
        lesson.setCreatedAt(LocalDateTime.now());
        lesson.setUpdatedAt(LocalDateTime.now());
        return lessonRepository.save(lesson);
    }
    public Lesson updateLesson(Long lessonId, LessonRequest request, String instructorEmail) {
        Lesson lesson = getLessonEntityById(lessonId);
        User instructor = userService.findByEmail(instructorEmail);
        // Check ownership
        if (!lesson.getCourse().getInstructor().getId().equals(instructor.getId())) {
            throw new RuntimeException("You don't have permission to update this lesson");
        }
        if (request.getTitle() != null) {
            lesson.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            lesson.setDescription(request.getDescription());
        }
        if (request.getVideoUrl() != null) {
            lesson.setVideoUrl(request.getVideoUrl());
        }
        if (request.getDuration() != null) {
            lesson.setDuration(request.getDuration());
        }
        if (request.getOrderIndex() != null) {
            lesson.setOrderIndex(request.getOrderIndex());
        }
        lesson.setUpdatedAt(LocalDateTime.now());
        return lessonRepository.save(lesson);
    }
    public Lesson getLessonById(Long id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));
    }
    public Lesson getLessonEntityById(Long id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));
    }
    public List<Lesson> getLessonsByCourseId(Long courseId) {
        return lessonRepository.findByCourseIdOrderByOrderIndex(courseId);
    }
    public List<Lesson> getLessonsByCourse(Long courseId) {
        return lessonRepository.findByCourseIdOrderByOrderIndex(courseId);
    }
    public void deleteLesson(Long lessonId, String instructorEmail) {
        Lesson lesson = getLessonEntityById(lessonId);
        User instructor = userService.findByEmail(instructorEmail);
        // Check ownership
        if (!lesson.getCourse().getInstructor().getId().equals(instructor.getId())) {
            throw new RuntimeException("You don't have permission to delete this lesson");
        }
        lessonRepository.delete(lesson);
    }
    public int getTotalLessonsByCourse(Long courseId) {
        return lessonRepository.countByCourseId(courseId);
    }
    public Lesson updateVideoUrl(Long lessonId, String videoUrl, String instructorEmail) {
        Lesson lesson = getLessonEntityById(lessonId);
        User instructor = userService.findByEmail(instructorEmail);
        // Check ownership
        if (!lesson.getCourse().getInstructor().getId().equals(instructor.getId())) {
            throw new RuntimeException("You don't have permission to update this lesson");
        }
        lesson.setVideoUrl(videoUrl);
        lesson.setUpdatedAt(LocalDateTime.now());
        return lessonRepository.save(lesson);
    }
}