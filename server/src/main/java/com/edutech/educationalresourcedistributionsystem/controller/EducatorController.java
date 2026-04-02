package com.edutech.educationalresourcedistributionsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.educationalresourcedistributionsystem.entity.Event;
import com.edutech.educationalresourcedistributionsystem.service.EventService;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/educator")
@CrossOrigin(origins = "*")
public class EducatorController {

    private static final Logger logger = LoggerFactory.getLogger(EducatorController.class);

    @Autowired
    private EventService eventService;

    @GetMapping("/agenda")
    public ResponseEntity<List<Event>> viewEventsAgenda() {
        logger.info("Fetching all events agenda...");
        List<Event> events = eventService.getAllEvents();
        logger.debug("Number of events fetched: {}", events.size());
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @PutMapping("/update-material/{eventId}")
    public ResponseEntity<Event> updateEventMaterial(
            @PathVariable Long eventId,
            @RequestBody Event updateEvent) {
        logger.info("Updating event materials for eventId: {}", eventId);
        try {
            Event updated = eventService.updateEvent(eventId, updateEvent);
            logger.info("Event updated successfully: {}", updated.getName());
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error updating event with id {}: {}", eventId, e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}


// package com.edutech.educationalresourcedistributionsystem.controller;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import com.edutech.educationalresourcedistributionsystem.entity.Event;
// import com.edutech.educationalresourcedistributionsystem.service.EventService;

// import java.util.List;

// @RestController
// @RequestMapping("/api/educator")
// @CrossOrigin(origins = "*")
// public class EducatorController {

//     @Autowired
//     private EventService eventService;

//     @GetMapping("/agenda")
//     public ResponseEntity<List<Event>> viewEventsAgenda() {
//         List<Event> events = eventService.getAllEvents();
//         return new ResponseEntity<>(events, HttpStatus.OK);
//     }

//     @PutMapping("/update-material/{eventId}")
//     public ResponseEntity<Event> updateEventMaterial(
//             @PathVariable Long eventId,
//             @RequestBody Event updateEvent) {
//         Event updated = eventService.updateEvent(eventId, updateEvent);
//         return new ResponseEntity<>(updated, HttpStatus.OK);
//     }
// }
