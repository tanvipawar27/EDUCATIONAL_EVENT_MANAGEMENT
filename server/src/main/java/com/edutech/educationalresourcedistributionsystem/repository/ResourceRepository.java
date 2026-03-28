package com.edutech.educationalresourcedistributionsystem.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.educationalresourcedistributionsystem.entity.Resource;

@Repository
public interface ResourceRepository extends JpaRepository<Resource,Long>{
    // extend jpa repostiory and add custom method if needed
}
