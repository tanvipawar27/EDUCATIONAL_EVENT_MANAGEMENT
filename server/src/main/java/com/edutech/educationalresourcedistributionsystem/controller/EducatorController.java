package com.edutech.educationalresourcedistributionsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.educationalresourcedistributionsystem.entity.Event;
import com.edutech.educationalresourcedistributionsystem.service.EventService;

import java.util.List;

@RestController
@RequestMapping("/api/educator")
@CrossOrigin(origins = "*")
public class EducatorController {

    @Autowired
    private EventService eventService;

    @GetMapping("/agenda")
    public ResponseEntity<List<Event>> viewEventsAgenda() {
        List<Event> events = eventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @PutMapping("/update-material/{eventId}")
    public ResponseEntity<Event> updateEventMaterial(
            @PathVariable Long eventId,
            @RequestBody Event updateEvent) {
        Event updated = eventService.updateEvent(eventId, updateEvent);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }
}
