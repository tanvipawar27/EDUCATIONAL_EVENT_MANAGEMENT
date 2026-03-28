package com.edutech.educationalresourcedistributionsystem.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.educationalresourcedistributionsystem.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    // extend jpa repostiory and add custom method if needed
    User findByUsername(String username);
}
