package com.edutech.educationalresourcedistributionsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.educationalresourcedistributionsystem.entity.Event;
import com.edutech.educationalresourcedistributionsystem.entity.Resource;
import com.edutech.educationalresourcedistributionsystem.repository.EventRepository;
import com.edutech.educationalresourcedistributionsystem.repository.ResourceRepository;

import javax.persistence.EntityNotFoundException;
import java.util.List;


@Service
public class EventService {
   @Autowired
   private EventRepository eventRepository;
   @Autowired
   private ResourceRepository resourceRepository;
   public Event createEvent(Event event) {
       return eventRepository.save(event);
   }
   public List<Event> getAllEvents() {
       return eventRepository.findAll();
   }
   public Event updateEvent(Long eventId, Event updateEvent) {
       Event existing = eventRepository.findById(eventId)
               .orElseThrow(() -> new RuntimeException("Event not found"));
       existing.setName(updateEvent.getName());
       existing.setDescription(updateEvent.getDescription());
       existing.setMaterials(updateEvent.getMaterials());
       return eventRepository.save(existing);
   }
   public Event allocateResourceToEvent(Long eventId, Long resourceId) {
       Event event = eventRepository.findById(eventId)
               .orElseThrow(() -> new RuntimeException("Event not found"));
       Resource resource = resourceRepository.findById(resourceId)
               .orElseThrow(() -> new RuntimeException("Resource not found"));
       resource.setEvent(event);
       resourceRepository.save(resource);
       return eventRepository.findById(eventId).get();
   }
}

    