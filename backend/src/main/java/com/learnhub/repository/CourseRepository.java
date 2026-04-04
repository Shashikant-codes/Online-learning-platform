package com.learnhub.repository;
import com.learnhub.model.Course;
import com.learnhub.model.User;
//import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByInstructor(User instructor);

    List<Course> findByInstructorId(Long instructorId);

    List<Course> findByActiveTrue();

    List<Course> findByCategoryIdAndActiveTrue(Long categoryId);

    @Query("SELECT c FROM Course c JOIN Enrollment e ON c = e.course WHERE e.student.id = :userId ORDER BY e.enrolledAt DESC")
    List<Course> findEnrolledCoursesByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Course c WHERE c.active = true AND (LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Course> searchByTitleOrDescription(@Param("keyword") String keyword);

    @Query("SELECT c FROM Course c WHERE c.active = true ORDER BY c.enrolledCount DESC")
    List<Course> findPopularCourses(int limit);

    @Query("SELECT c FROM Course c WHERE c.active = true ORDER BY c.createdAt DESC")
    List<Course> findRecentCourses(int limit);

    @Query("SELECT COUNT(c) FROM Course c WHERE c.instructor.id = :instructorId")
    int countByInstructorId(@Param("instructorId") Long instructorId);
}