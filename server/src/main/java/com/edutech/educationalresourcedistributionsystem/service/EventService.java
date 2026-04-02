package com.edutech.educationalresourcedistributionsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.educationalresourcedistributionsystem.entity.Event;
import com.edutech.educationalresourcedistributionsystem.entity.Resource;
import com.edutech.educationalresourcedistributionsystem.repository.EventRepository;
import com.edutech.educationalresourcedistributionsystem.repository.ResourceRepository;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EventService {

    private static final Logger logger = LoggerFactory.getLogger(EventService.class);

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    public Event createEvent(Event event) {
        logger.info("Creating new event: {}", event.getName());
        Event saved = eventRepository.save(event);
        logger.info("Event created successfully with ID: {}", saved.getId());
        return saved;
    }

    public List<Event> getAllEvents() {
        logger.info("Fetching all events...");
        List<Event> events = eventRepository.findAll();
        logger.debug("Number of events fetched: {}", events.size());
        return events;
    }

    public Event updateEvent(Long eventId, Event updateEvent) {
        logger.info("Updating event with ID: {}", eventId);
        Event existing = eventRepository.findById(eventId)
                .orElseThrow(() -> {
                    logger.error("Event with ID {} not found", eventId);
                    return new RuntimeException("Event not found");
                });

        existing.setName(updateEvent.getName());
        existing.setDescription(updateEvent.getDescription());
        existing.setMaterials(updateEvent.getMaterials());

        Event updated = eventRepository.save(existing);
        logger.info("Event updated successfully: {}", updated.getName());
        return updated;
    }

    public Event allocateResourceToEvent(Long eventId, Long resourceId) {
        logger.info("Allocating resource {} to event {}", resourceId, eventId);

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> {
                    logger.error("Event with ID {} not found", eventId);
                    return new RuntimeException("Event not found");
                });

        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> {
                    logger.error("Resource with ID {} not found", resourceId);
                    return new RuntimeException("Resource not found");
                });

        resource.setEvent(event);
        event.getResourceAllocations().add(resource);

        resourceRepository.save(resource);
        Event updatedEvent = eventRepository.save(event);

        logger.info("Resource {} allocated successfully to event {}", resourceId, eventId);
        return updatedEvent;
    }
}

// package com.edutech.educationalresourcedistributionsystem.service;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import com.edutech.educationalresourcedistributionsystem.entity.Event;
// import com.edutech.educationalresourcedistributionsystem.entity.Resource;
// import com.edutech.educationalresourcedistributionsystem.repository.EventRepository;
// import com.edutech.educationalresourcedistributionsystem.repository.ResourceRepository;

// import javax.persistence.EntityNotFoundException;
// import java.util.List;


// @Service
// public class EventService {
//    @Autowired
//    private EventRepository eventRepository;
//    @Autowired
//    private ResourceRepository resourceRepository;
//    public Event createEvent(Event event) {
//        return eventRepository.save(event);
//    }
//    public List<Event> getAllEvents() {
//        return eventRepository.findAll();
//    }
//    public Event updateEvent(Long eventId, Event updateEvent) {
//        Event existing = eventRepository.findById(eventId)
//                .orElseThrow(() -> new RuntimeException("Event not found"));
//        existing.setName(updateEvent.getName());
//        existing.setDescription(updateEvent.getDescription());
//        existing.setMaterials(updateEvent.getMaterials());
//        return eventRepository.save(existing);
//    }

// public Event allocateResourceToEvent(Long eventId, Long resourceId) {
//     Event event = eventRepository.findById(eventId)
//             .orElseThrow(() -> new RuntimeException("Event not found"));
//     Resource resource = resourceRepository.findById(resourceId)
//             .orElseThrow(() -> new RuntimeException("Resource not found"));

//     // Set relationship both ways
//     resource.setEvent(event);
//     event.getResourceAllocations().add(resource);

//     // Save resource and event
//     resourceRepository.save(resource);
//     return eventRepository.save(event);
// }

// }

    