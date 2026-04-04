package com.learnhub.repository;
import com.learnhub.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findByCourseIdOrderByOrderIndex(Long courseId);

    Optional<Lesson> findByCourseIdAndTitle(Long courseId, String title);

    int countByCourseId(Long courseId);

    @Query("SELECT COALESCE(SUM(l.duration), 0) FROM Lesson l WHERE l.course.id = :courseId")
    int getTotalDurationByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT MAX(l.orderIndex) FROM Lesson l WHERE l.course.id = :courseId")
    Integer getMaxOrderIndexByCourseId(@Param("courseId") Long courseId);
}