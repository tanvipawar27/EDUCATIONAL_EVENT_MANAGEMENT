package com.edutech.educationalresourcedistributionsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.educationalresourcedistributionsystem.entity.Event;
import com.edutech.educationalresourcedistributionsystem.entity.EventRegistration;
import com.edutech.educationalresourcedistributionsystem.repository.EventRegistrationRepository;
import com.edutech.educationalresourcedistributionsystem.repository.EventRepository;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class RegistrationService {

    private static final Logger logger = LoggerFactory.getLogger(RegistrationService.class);

    @Autowired
    private EventRegistrationRepository registrationRepository;

    @Autowired
    private EventRepository eventRepository;

    public EventRegistration registerForEvent(Long eventId, EventRegistration registration) {
        logger.info("Registering student {} for event {}", registration.getStudentId(), eventId);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> {
                    logger.error("Event with ID {} not found", eventId);
                    return new RuntimeException("Event not found");
                });

        registration.setEvent(event);
        registration.setStatus("REGISTERED");

        EventRegistration saved = registrationRepository.save(registration);
        logger.info("Student {} successfully registered for event {}", registration.getStudentId(), eventId);
        return saved;
    }

    public List<EventRegistration> getRegistrationStatus(Long studentId) {
        logger.info("Fetching registration status for student {}", studentId);
        List<EventRegistration> registrations = registrationRepository.findByStudentId(studentId);
        logger.debug("Student {} has {} registrations", studentId, registrations.size());
        return registrations;
    }
}

// package com.edutech.educationalresourcedistributionsystem.service;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import com.edutech.educationalresourcedistributionsystem.entity.Event;
// import com.edutech.educationalresourcedistributionsystem.entity.EventRegistration;
// import com.edutech.educationalresourcedistributionsystem.repository.EventRegistrationRepository;
// import com.edutech.educationalresourcedistributionsystem.repository.EventRepository;

// import javax.persistence.EntityNotFoundException;
// import java.util.List;

// @Service
// public class RegistrationService {
//    @Autowired
//    private EventRegistrationRepository registrationRepository;
//    @Autowired
//    private EventRepository eventRepository;
//    public EventRegistration registerForEvent(Long eventId, EventRegistration registration) {
//        Event event = eventRepository.findById(eventId)
//                .orElseThrow(() -> new RuntimeException("Event not found"));
//        registration.setEvent(event);
//        registration.setStatus("REGISTERED");
//        return registrationRepository.save(registration);
//    }
//    public List<EventRegistration> getRegistrationStatus(Long studentId) {
//        return registrationRepository.findByStudentId(studentId);
//    }
// }





