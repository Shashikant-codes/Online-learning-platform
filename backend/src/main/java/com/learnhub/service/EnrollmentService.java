package com.learnhub.service;
import com.learnhub.model.Course;
import com.learnhub.model.Enrollment;
import com.learnhub.model.User;
import com.learnhub.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@Service
@Transactional
public class EnrollmentService {
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    @Autowired
    private CourseService courseService;
    @Autowired
    private UserService userService;
    public Enrollment enrollStudent(Long courseId, String userEmail) {
        User student = userService.findByEmail(userEmail);
        Course course = courseService.getCourseEntityById(courseId);
        // Check if already enrolled
        Optional<Enrollment> existing = enrollmentRepository.findByStudentAndCourse(student, course);
        if (existing.isPresent()) {
            throw new RuntimeException("Student is already enrolled in this course");
        }
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrolledAt(LocalDateTime.now());
        enrollment.setCompleted(false);
        enrollment.setProgress(0.0);
        return enrollmentRepository.save(enrollment);
    }
    public boolean isUserEnrolled(Long userId, Long courseId) {
        return enrollmentRepository.existsByStudentIdAndCourseId(userId, courseId);
    }
    public List<Enrollment> getUserEnrollments(Long userId) {
        return enrollmentRepository.findByStudentId(userId);
    }
    public List<Enrollment> getCourseEnrollments(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }
    public Optional<Enrollment> getEnrollment(Long userId, Long courseId) {
        return enrollmentRepository.findByStudentIdAndCourseId(userId, courseId);
    }
    public Enrollment updateProgress(Long userId, Long courseId, Double progress) {
        Optional<Enrollment> enrollmentOpt = getEnrollment(userId, courseId);
        if (enrollmentOpt.isEmpty()) {
            throw new RuntimeException("Enrollment not found");
        }
        Enrollment enrollment = enrollmentOpt.get();
        enrollment.setProgress(progress);

        if (progress >= 100.0) {
            enrollment.setCompleted(true);
        }

        return enrollmentRepository.save(enrollment);
    }
    public int getEnrolledStudentsCount(Long courseId) {
        return enrollmentRepository.countByCourseId(courseId);
    }
    public boolean isEnrolled(String userEmail, Long courseId) {
        User student = userService.findByEmail(userEmail);
        return enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId);
    }
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }
    public void deleteEnrollment(Long enrollmentId) {
        enrollmentRepository.deleteById(enrollmentId);
    }
}