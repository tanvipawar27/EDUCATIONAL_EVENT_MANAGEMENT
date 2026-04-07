package com.edutech.educationalresourcedistributionsystem.service;
 
import com.edutech.educationalresourcedistributionsystem.entity.Feedback;

import com.edutech.educationalresourcedistributionsystem.repository.FeedbackRepository;

import org.springframework.stereotype.Service;

import java.util.List;
 
@Service

public class FeedbackService {

    private final FeedbackRepository repo;
 
    public FeedbackService(FeedbackRepository repo) {

        this.repo = repo;

    }
 
    public Feedback saveFeedback(Feedback feedback) {

        return repo.save(feedback);

    }
 
    public List<Feedback> getAllFeedback() {

        return repo.findAll();

    }

}

