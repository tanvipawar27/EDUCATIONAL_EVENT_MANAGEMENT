package com.edutech.educationalresourcedistributionsystem.controller;
 
import com.edutech.educationalresourcedistributionsystem.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {
 
    @Autowired
    private ChatService chatService;
 
    @PostMapping("/message")
    public ResponseEntity<String> chat(@RequestBody String userMessage) {
        String reply = chatService.getChatResponse(userMessage);
        return ResponseEntity.ok(reply);
    }
}