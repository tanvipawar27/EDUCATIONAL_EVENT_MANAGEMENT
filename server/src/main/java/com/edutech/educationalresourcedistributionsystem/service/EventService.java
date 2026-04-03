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

    // ✅ Create Event
    public Event createEvent(Event event) {
        logger.info("Creating new event: {}", event.getName());
        Event saved = eventRepository.save(event);
        logger.info("Event created successfully with ID: {}", saved.getId());
        return saved;
    }

    // ✅ Get All Events
    public List<Event> getAllEvents() {
        logger.info("Fetching all events...");
        List<Event> events = eventRepository.findAll();
        logger.debug("Number of events fetched: {}", events.size());
        return events;
    }

    // ✅ Get Event by ID
    public Event getEventById(Long eventId) {
        logger.info("Fetching event with ID: {}", eventId);
        return eventRepository.findById(eventId)
                .orElseThrow(() -> {
                    logger.error("Event with ID {} not found", eventId);
                    return new RuntimeException("Event not found");
                });
    }

    // ✅ Update Event
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

    // ✅ Delete Event
    public void deleteEvent(Long eventId) {
        logger.info("Attempting to delete event with ID: {}", eventId);
        if (!eventRepository.existsById(eventId)) {
            logger.error("Event with ID {} not found", eventId);
            throw new RuntimeException("Event not found");
        }
        eventRepository.deleteById(eventId);
        logger.info("Event with ID {} deleted successfully", eventId);
    }

    // ✅ Allocate Resource to Event
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

    // ✅ Search Events by Name
    public List<Event> searchEventsByName(String keyword) {
        logger.info("Searching events with keyword: {}", keyword);
        List<Event> results = eventRepository.findByNameContainingIgnoreCase(keyword);
        logger.debug("Number of events found: {}", results.size());
        return results;
    }

    // ✅ Get All Events with Allocated Resources
    public List<Event> getAllEventsWithResources() {
        logger.info("Fetching all events with their allocated resources...");
        List<Event> events = eventRepository.findAll();

        // Force initialization of resources if using LAZY fetch
        for (Event event : events) {
            if (event.getResourceAllocations() != null) {
                event.getResourceAllocations().size();
            }
        }

        logger.debug("Number of events with resources fetched: {}", events.size());
        return events;
    }
}
