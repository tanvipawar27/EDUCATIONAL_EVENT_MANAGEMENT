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

    // ✅ Create Event
    @PostMapping("/event")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        logger.info("Request received to create event: {}", event.getName());
        Event createdEvent = eventService.createEvent(event);
        logger.info("Event created successfully with ID: {}", createdEvent.getId());
        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }

    // ✅ Get All Events
    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        logger.info("Fetching all events...");
        List<Event> events = eventService.getAllEvents();
        logger.debug("Number of events fetched: {}", events.size());
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    // ✅ Delete Event
    @DeleteMapping("/event/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        logger.info("Request received to delete event with ID: {}", id);
        try {
            eventService.deleteEvent(id);
            logger.info("Event with ID {} deleted successfully", id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            logger.error("Failed to delete event with ID {}: {}", id, e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // ✅ Create Resource
    @PostMapping("/resource")
    public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
        logger.info("Request received to create resource: {}", resource.getResourceType());
        Resource createdResource = resourceService.createResource(resource);
        logger.info("Resource created successfully with ID: {}", createdResource.getId());
        return new ResponseEntity<>(createdResource, HttpStatus.CREATED);
    }

    // ✅ Get All Resources
    @GetMapping("/resources")
    public ResponseEntity<List<Resource>> getAllResources() {
        logger.info("Fetching all resources...");
        List<Resource> resources = resourceService.getAllResources();
        logger.debug("Number of resources fetched: {}", resources.size());
        return new ResponseEntity<>(resources, HttpStatus.OK);
    }

    // ✅ Allocate Resource to Event
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

    // ✅ Get All Allocations (Events with Resources)
    @GetMapping("/allocations")
    public ResponseEntity<List<Event>> getAllAllocations() {
        logger.info("Fetching all allocations...");
        List<Event> eventsWithResources = eventService.getAllEventsWithResources();
        logger.debug("Number of events with allocations fetched: {}", eventsWithResources.size());
        return new ResponseEntity<>(eventsWithResources, HttpStatus.OK);
    }

    // ✅ Delete Resource
@DeleteMapping("/resource/{id}")
public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
    logger.info("Request received to delete resource with ID: {}", id);
    try {
        resourceService.deleteResource(id);
        logger.info("Resource with ID {} deleted successfully", id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } catch (Exception e) {
        logger.error("Failed to delete resource with ID {}: {}", id, e.getMessage(), e);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}


    // ✅ Get Event by ID
@GetMapping("/event/{id}")
public ResponseEntity<Event> getEventById(@PathVariable Long id) {
    logger.info("Fetching event with ID: {}", id);
    try {
        Event event = eventService.getEventById(id);
        if (event != null) {
            logger.info("Event with ID {} fetched successfully", id);
            return new ResponseEntity<>(event, HttpStatus.OK);
        } else {
            logger.warn("Event with ID {} not found", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    } catch (Exception e) {
        logger.error("Error fetching event with ID {}: {}", id, e.getMessage(), e);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

}
