 
package com.edutech.educationalresourcedistributionsystem.controller;
 
import com.edutech.educationalresourcedistributionsystem.entity.Feedback;

import com.edutech.educationalresourcedistributionsystem.service.FeedbackService;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
 
import java.util.List;
 
@RestController

@RequestMapping("/api/feedback")

public class FeedbackController {

    private final FeedbackService service;
 
    public FeedbackController(FeedbackService service) {

        this.service = service;

    }
 
    @PostMapping

    public ResponseEntity<Feedback> submitFeedback(@RequestBody Feedback feedback) {

        Feedback saved = service.saveFeedback(feedback);

        return ResponseEntity.ok(saved);

    }
 
    @GetMapping

    public ResponseEntity<List<Feedback>> getFeedback() {

        List<Feedback> feedbackList = service.getAllFeedback();

        return ResponseEntity.ok(feedbackList);

    }

}

 



