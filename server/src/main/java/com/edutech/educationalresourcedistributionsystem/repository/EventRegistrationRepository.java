package com.edutech.educationalresourcedistributionsystem.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.educationalresourcedistributionsystem.entity.EventRegistration;

import java.util.List;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration,Long> {
    // extend jpa repostiory and add custom method if needed
    List<EventRegistration> findByStudentId(Long studentId);
    
}
