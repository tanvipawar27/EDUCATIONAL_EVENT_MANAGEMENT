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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/institution")
@CrossOrigin(origins = "*")
public class InstitutionController {

    private static final Logger logger = LoggerFactory.getLogger(InstitutionController.class);

    @Autowired
    private EventService eventService;

    @Autowired
    private ResourceService resourceService;

    @PostMapping("/event")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        logger.info("Request received to create event: {}", event.getName());
        Event createdEvent = eventService.createEvent(event);
        logger.info("Event created successfully with ID: {}", createdEvent.getId());
        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }

    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        logger.info("Fetching all events...");
        List<Event> events = eventService.getAllEvents();
        logger.debug("Number of events fetched: {}", events.size());
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @PostMapping("/resource")
    public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
        logger.info("Request received to create resource: {}", resource.getResourceType());
        Resource createdResource = resourceService.createResource(resource);
        logger.info("Resource created successfully with ID: {}", createdResource.getId());
        return new ResponseEntity<>(createdResource, HttpStatus.CREATED);
    }

    @GetMapping("/resources")
    public ResponseEntity<List<Resource>> getAllResources() {
        logger.info("Fetching all resources...");
        List<Resource> resources = resourceService.getAllResources();
        logger.debug("Number of resources fetched: {}", resources.size());
        return new ResponseEntity<>(resources, HttpStatus.OK);
    }

    @PostMapping("/event/allocate-resources")
    public ResponseEntity<Event> allocateResource(
            @RequestParam("eventId") Long eventId,
            @RequestParam("resourceId") Long resourceId) {
        logger.info("Allocating resource {} to event {}", resourceId, eventId);
        try {
            Event event = eventService.allocateResourceToEvent(eventId, resourceId);
            logger.info("Resource {} allocated successfully to event {}", resourceId, eventId);
            return new ResponseEntity<>(event, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Failed to allocate resource {} to event {}: {}", resourceId, eventId, e.getMessage(), e);
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
// import com.edutech.educationalresourcedistributionsystem.entity.Resource;
// import com.edutech.educationalresourcedistributionsystem.service.EventService;
// import com.edutech.educationalresourcedistributionsystem.service.ResourceService;

// import java.util.List;


// @RestController
// @RequestMapping("/api/institution")
// @CrossOrigin(origins = "*")
// public class InstitutionController {

//     @Autowired
//     private EventService eventService;

//     @Autowired
//     private ResourceService resourceService;

//     @PostMapping("/event")
//     public ResponseEntity<Event> createEvent(@RequestBody Event event) {
//         Event createdEvent = eventService.createEvent(event);
//         return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
//     }

//     @GetMapping("/events")
//     public ResponseEntity<List<Event>> getAllEvents() {
//         List<Event> events = eventService.getAllEvents();
//         return new ResponseEntity<>(events, HttpStatus.OK);
//     }

//     @PostMapping("/resource")
//     public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
//         Resource createdResource = resourceService.createResource(resource);
//         return new ResponseEntity<>(createdResource, HttpStatus.CREATED);
//     }

//     @GetMapping("/resources")
//     public ResponseEntity<List<Resource>> getAllResources() {
//         List<Resource> resources = resourceService.getAllResources();
//         return new ResponseEntity<>(resources, HttpStatus.OK);
//     }

//     @PostMapping("/event/allocate-resources")
//     public ResponseEntity<Event> allocateResource(
//             @RequestParam("eventId") Long eventId,
//             @RequestParam("resourceId") Long resourceId) {
//         Event event = eventService.allocateResourceToEvent(eventId, resourceId);
//         return new ResponseEntity<>(event, HttpStatus.OK);
//     }
// }
