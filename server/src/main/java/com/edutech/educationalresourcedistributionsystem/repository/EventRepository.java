package com.edutech.educationalresourcedistributionsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.educationalresourcedistributionsystem.entity.Event;
import java.util.List; 

@Repository
public interface EventRepository extends JpaRepository<Event,Long> {
    // extend jpa repostiory and add custom method if needed
      List<Event> findByNameContainingIgnoreCase(String name);
}
