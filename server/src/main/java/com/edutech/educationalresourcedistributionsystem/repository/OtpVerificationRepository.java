package com.edutech.educationalresourcedistributionsystem.repository;
 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.edutech.educationalresourcedistributionsystem.entity.OtpVerification;
 
import java.util.Optional;
 
@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
 
    // ✅ Find OTP record by email
    Optional<OtpVerification> findByEmail(String email);
 
    // ✅ Check if an OTP exists for a given email
    boolean existsByEmail(String email);
 
    // ✅ Optional: Delete OTP record after verification
    void deleteByEmail(String email);
}