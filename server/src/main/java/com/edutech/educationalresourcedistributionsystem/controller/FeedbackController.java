package com.edutech.educationalresourcedistributionsystem.controller;

import com.edutech.educationalresourcedistributionsystem.entity.Feedback;
import com.edutech.educationalresourcedistributionsystem.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;              // ✅ Autowired
import org.springframework.web.bind.annotation.*;                         // ✅ RestController, mappings
import java.time.LocalDateTime;                                          // ✅ LocalDateTime
import java.util.List;                                                   // ✅ List

@RestController
@RequestMapping("/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    // STUDENT submits feedback
    @PostMapping("/submit")
    public Feedback submitFeedback(@RequestBody Feedback feedback) {
        feedback.setSubmittedAt(LocalDateTime.now());
        return feedbackRepository.save(feedback);
    }

    // INSTITUTION/Admin views all feedback
    @GetMapping("/all")
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }
}
