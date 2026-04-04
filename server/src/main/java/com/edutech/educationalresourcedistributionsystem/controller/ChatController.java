package com.edutech.educationalresourcedistributionsystem.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.edutech.educationalresourcedistributionsystem.dto.ChatRequest;
import com.edutech.educationalresourcedistributionsystem.dto.ChatResponse;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatController {

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {

        String msg = request.getMessage().toLowerCase();
        String reply;

        if (msg.contains("register")) {
            reply = "Go to Events → Click Register → Submit details.";
        } else if (msg.contains("resource")) {
            reply = "Resources are allocated by Institution after approval.";
        } else if (msg.contains("role")) {
            reply = "Your role defines what actions you can perform.";
        } else {
            reply = "Sorry, I didn’t understand. Try asking about events or resources.";
        }

        ChatResponse response = new ChatResponse();
        response.setReply(reply);
        return response;
    }
}
