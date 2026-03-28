package com.edutech.educationalresourcedistributionsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.educationalresourcedistributionsystem.entity.Event;
import com.edutech.educationalresourcedistributionsystem.entity.EventRegistration;
import com.edutech.educationalresourcedistributionsystem.repository.EventRegistrationRepository;
import com.edutech.educationalresourcedistributionsystem.repository.EventRepository;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class RegistrationService {
   @Autowired
   private EventRegistrationRepository registrationRepository;
   @Autowired
   private EventRepository eventRepository;
   public EventRegistration registerForEvent(Long eventId, EventRegistration registration) {
       Event event = eventRepository.findById(eventId)
               .orElseThrow(() -> new RuntimeException("Event not found"));
       registration.setEvent(event);
       registration.setStatus("REGISTERED");
       return registrationRepository.save(registration);
   }
   public List<EventRegistration> getRegistrationStatus(Long studentId) {
       return registrationRepository.findByStudentId(studentId);
   }
}





