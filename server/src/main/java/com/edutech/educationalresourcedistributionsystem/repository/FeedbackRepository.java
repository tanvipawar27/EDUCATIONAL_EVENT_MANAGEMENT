package com.edutech.educationalresourcedistributionsystem.repository;
 
import com.edutech.educationalresourcedistributionsystem.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}