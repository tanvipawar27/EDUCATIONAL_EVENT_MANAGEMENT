package com.edutech.educationalresourcedistributionsystem.repository;

import com.edutech.educationalresourcedistributionsystem.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;  // ✅ JpaRepository

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {}
