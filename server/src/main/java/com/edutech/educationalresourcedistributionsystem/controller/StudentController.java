package com.edutech.educationalresourcedistributionsystem.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.educationalresourcedistributionsystem.entity.EventRegistration;
import com.edutech.educationalresourcedistributionsystem.service.RegistrationService;

import java.util.List;


@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private RegistrationService registrationService;

    @PostMapping("/register/{eventId}")
    public ResponseEntity<EventRegistration> registerForEvent(
            @PathVariable Long eventId,
            @RequestBody EventRegistration registration) {
        EventRegistration saved = registrationService.registerForEvent(eventId, registration);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
    
    @GetMapping("/registration-status/{studentId}")
    public ResponseEntity<List<EventRegistration>> viewRegistrationStatus(
            @PathVariable Long studentId) {
        List<EventRegistration> registrations = registrationService.getRegistrationStatus(studentId);
        return new ResponseEntity<>(registrations, HttpStatus.OK);
    }
}
