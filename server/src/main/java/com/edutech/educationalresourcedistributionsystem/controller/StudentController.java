package com.edutech.educationalresourcedistributionsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.educationalresourcedistributionsystem.entity.EventRegistration;
import com.edutech.educationalresourcedistributionsystem.service.RegistrationService;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "*")
public class StudentController {

    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

    @Autowired
    private RegistrationService registrationService;

    @PostMapping("/register/{eventId}")
    public ResponseEntity<EventRegistration> registerForEvent(
            @PathVariable Long eventId,
            @RequestBody EventRegistration registration) {
        logger.info("Student {} attempting to register for event {}", registration.getStudentId(), eventId);
        try {
            EventRegistration saved = registrationService.registerForEvent(eventId, registration);
            logger.info("Student {} successfully registered for event {}", registration.getStudentId(), eventId);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Failed to register student {} for event {}: {}", registration.getStudentId(), eventId, e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/registration-status/{studentId}")
    public ResponseEntity<List<EventRegistration>> viewRegistrationStatus(
            @PathVariable Long studentId) {
        logger.info("Fetching registration status for student {}", studentId);
        try {
            List<EventRegistration> registrations = registrationService.getRegistrationStatus(studentId);
            logger.debug("Student {} has {} registrations", studentId, registrations.size());
            return new ResponseEntity<>(registrations, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching registration status for student {}: {}", studentId, e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
