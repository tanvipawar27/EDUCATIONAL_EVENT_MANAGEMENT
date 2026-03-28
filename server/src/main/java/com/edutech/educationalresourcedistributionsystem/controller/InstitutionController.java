package com.edutech.educationalresourcedistributionsystem.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.educationalresourcedistributionsystem.entity.Event;
import com.edutech.educationalresourcedistributionsystem.entity.Resource;
import com.edutech.educationalresourcedistributionsystem.service.EventService;
import com.edutech.educationalresourcedistributionsystem.service.ResourceService;

import java.util.List;


@RestController
@RequestMapping("/api/institution")
@CrossOrigin(origins = "*")
public class InstitutionController {
   @Autowired
   private EventService eventService;
   @Autowired
   private ResourceService resourceService;
   @PostMapping("/event")
   public ResponseEntity<Event> createEvent(@RequestBody Event event) {
       return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(event));
   }
   @GetMapping("/events")
   public ResponseEntity<List<Event>> getAllEvents() {
       return ResponseEntity.ok(eventService.getAllEvents());
   }
   @PostMapping("/resource")
   public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
       return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.createResource(resource));
   }
   @GetMapping("/resources")
   public ResponseEntity<List<Resource>> getAllResources() {
       return ResponseEntity.ok(resourceService.getAllResources());
   }
   @PutMapping("/event/allocate-resources")
   public ResponseEntity<Event> allocateResource(@RequestParam("eventId") Long eventId,
                                                  @RequestParam("resourceId") Long resourceId) {
       return ResponseEntity.ok(eventService.allocateResourceToEvent(eventId, resourceId));
   }
}