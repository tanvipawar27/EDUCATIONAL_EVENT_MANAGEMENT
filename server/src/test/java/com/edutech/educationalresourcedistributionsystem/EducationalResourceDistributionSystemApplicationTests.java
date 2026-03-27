package com.edutech.educationalresourcedistributionsystem;

import com.edutech.educationalresourcedistributionsystem.dto.LoginRequest;
import com.edutech.educationalresourcedistributionsystem.entity.Event;
import com.edutech.educationalresourcedistributionsystem.entity.EventRegistration;
import com.edutech.educationalresourcedistributionsystem.entity.Resource;
import com.edutech.educationalresourcedistributionsystem.entity.User;
import com.edutech.educationalresourcedistributionsystem.repository.EventRegistrationRepository;
import com.edutech.educationalresourcedistributionsystem.repository.EventRepository;
import com.edutech.educationalresourcedistributionsystem.repository.ResourceRepository;
import com.edutech.educationalresourcedistributionsystem.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.assertj.core.util.Lists;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import javax.transaction.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Transactional
class EducationalResourceDistributionSystemApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private EventRepository eventRepository;

	@Autowired
	private EventRegistrationRepository eventRegistrationRepository;

	@Autowired
	private ResourceRepository resourceRepository;

	@Autowired
	private UserRepository userRepository;


	@BeforeEach
	public void setUp() {
		// Clear the database before each test
		userRepository.deleteAll();
		eventRepository.deleteAll();
		eventRegistrationRepository.deleteAll();
		resourceRepository.deleteAll();
	}

	@Test
	public void testRegisterUser() throws Exception {
		// Create a User object for registration
		User user = new User();
		user.setUsername("testUser");
		user.setPassword("testPassword");
		user.setEmail("test@example.com");
		user.setRole("INSTITUTION");

		// Perform a POST request to the /register endpoint using MockMvc
		mockMvc.perform(post("/api/user/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsBytes(user)))
				.andExpect(jsonPath("$.username").value(user.getUsername()))
				.andExpect(jsonPath("$.email").value(user.getEmail()))
				.andExpect(jsonPath("$.role").value(user.getRole()));

		// Assert business is created in the database
		User savedUser = userRepository.findAll().get(0);
		assertEquals(user.getUsername(), savedUser.getUsername());
		assertEquals(user.getEmail(), savedUser.getEmail());
		assertEquals(user.getRole(), savedUser.getRole());
	}

	@Test
	public void testLoginUser() throws Exception {
		// Create a user for registration
		User user = new User();
		user.setUsername("testUser");
		user.setPassword("password");
		user.setRole("HOSPITAL");
		user.setEmail("testUser@gmail.com");
		// Register the user
		mockMvc.perform(post("/api/user/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(user)));

		// Login with the registered user
		LoginRequest loginRequest = new LoginRequest("testUser", "password");

		mockMvc.perform(post("/api/user/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest)))
				.andExpect(jsonPath("$.token").exists());
	}

	@Test
	public void testLoginWithWrongUsernameOrPassword() throws Exception {
		// Create a login request with a wrong username
		LoginRequest loginRequest = new LoginRequest("wronguser", "password");

		mockMvc.perform(post("/api/user/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest)))
				.andExpect(status().isUnauthorized()); // Expect a 401 Unauthorized response
	}

	@Test
	@WithMockUser(authorities = "INSTITUTION")
	public void testInstitutionShouldCreateEvent() throws Exception {
		// Create a sample event object for the request body
		Event event = new Event();
		event.setName("Sample Event");
		event.setDescription("Sample Event Description");

		// Convert the event object to JSON
		String eventJson = objectMapper.writeValueAsString(event);

		// Perform the API request using MockMvc
		mockMvc.perform(post("/api/institution/event")
						.content(eventJson)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.name").value("Sample Event"))
				.andExpect(jsonPath("$.description").value("Sample Event Description"));

		// Verify that the event is saved in the database
		Event savedEvent = eventRepository.findAll().get(0);
		assertNotNull(savedEvent);
		assertEquals(event.getName(), savedEvent.getName());
	}

	@Test
	@WithMockUser(authorities = "INSTITUTION")
	public void testInstitutionShouldGetAllEvents() throws Exception {
		Event event = new Event();
		event.setName("Sample Event");
		event.setDescription("Sample Event Description");
		eventRepository.save(event);

		Event event2 = new Event();
		event2.setName("Sample Event 2");
		event2.setDescription("Sample Event Description 2");
		eventRepository.save(event2);
		// Perform the API request using MockMvc
		mockMvc.perform(MockMvcRequestBuilders.get("/api/institution/events")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$[0].name").value("Sample Event")) // Assuming there is at least one event in the response
				.andExpect(jsonPath("$[0].description").value("Sample Event Description"))
				.andExpect(jsonPath("$[1].name").value("Sample Event 2"))
				.andExpect(jsonPath("$[1].description").value("Sample Event Description 2"));
	}

	@Test
	@WithMockUser(authorities = "INSTITUTION")
	public void testInstitutionShouldCreateResource() throws Exception {
		// Create a sample resource object for the request body
		Resource resource = new Resource();
		resource.setResourceType("Sample Resource");
		resource.setDescription("Sample Resource Description");

		// Convert the resource object to JSON
		String resourceJson = objectMapper.writeValueAsString(resource);

		// Perform the API request using MockMvc
		mockMvc.perform(MockMvcRequestBuilders.post("/api/institution/resource")
						.content(resourceJson)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.resourceType").value("Sample Resource"))
				.andExpect(jsonPath("$.description").value("Sample Resource Description"));

		// Verify that the resource is saved in the database
		Resource savedResource = resourceRepository.findAll().get(0);
		assertNotNull(savedResource);
		assertEquals(resource.getResourceType(), savedResource.getResourceType());
	}

	@Test
	@WithMockUser(authorities = "INSTITUTION")
	public void testInstitutionShouldGetAllResources() throws Exception {
		Resource resource = new Resource();
		resource.setResourceType("Sample Resource");
		resource.setDescription("Sample Resource Description");
		resource = resourceRepository.save(resource);

		Resource resource2 = new Resource();
		resource2.setResourceType("Sample Resource 2");
		resource2.setDescription("Sample Resource Description 2");
		resource2 = resourceRepository.save(resource2);

		// Perform the API request using MockMvc
		mockMvc.perform(MockMvcRequestBuilders.get("/api/institution/resources")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$[0].resourceType").value("Sample Resource")) // Assuming there is at least one event in the response
				.andExpect(jsonPath("$[0].description").value("Sample Resource Description"))
				.andExpect(jsonPath("$[1].resourceType").value("Sample Resource 2"))
				.andExpect(jsonPath("$[1].description").value("Sample Resource Description 2"));
	}

	@Test
	@WithMockUser(authorities = "INSTITUTION")
	public void testInstitutionShouldAllocateResource() throws Exception {
		// Create a sample event to use its ID in the API request
		Event event = new Event();
		event.setName("Sample Event");
		event.setDescription("Sample Event Description");
		event.setResourceAllocations(Lists.newArrayList());
		event = eventRepository.save(event);

		// Create a sample resource object for the request body
		Resource resource = new Resource();
		resource.setResourceType("Sample Resource");
		resource.setDescription("Sample Resource Description");
		resource = resourceRepository.save(resource);


		// Perform the API request using MockMvc
		mockMvc.perform(MockMvcRequestBuilders.post("/api/institution/event/allocate-resources")
						.param("eventId", event.getId().toString())
						.param("resourceId", resource.getId().toString())
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.name").value("Sample Event"))
				.andExpect(jsonPath("$.description").value("Sample Event Description"))
				.andExpect(jsonPath("$.resourceAllocations").isArray())
				.andExpect(jsonPath("$.resourceAllocations[0].resourceType").value("Sample Resource"))
				.andExpect(jsonPath("$.resourceAllocations[0].description").value("Sample Resource Description"));

		// Verify that the resource is saved in the database
		Event savedEvent = eventRepository.findAll().get(0);
		assertNotNull(savedEvent);
		assertEquals(event.getName(), savedEvent.getName());
		assertEquals(1, savedEvent.getResourceAllocations().size());
		assertEquals(resource.getResourceType(), savedEvent.getResourceAllocations().get(0).getResourceType());
	}

	@Test
	@WithMockUser(authorities = "EDUCATOR")
	public void testEducatorShouldGetAllEventsAgenda() throws Exception {
		Event event = new Event();
		event.setName("Sample Event");
		event.setDescription("Sample Event Description");
		eventRepository.save(event);

		Event event2 = new Event();
		event2.setName("Sample Event 2");
		event2.setDescription("Sample Event Description 2");
		eventRepository.save(event2);
		// Perform the API request using MockMvc
		mockMvc.perform(MockMvcRequestBuilders.get("/api/educator/agenda")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$[0].name").value("Sample Event")) // Assuming there is at least one event in the response
				.andExpect(jsonPath("$[0].description").value("Sample Event Description"))
				.andExpect(jsonPath("$[1].name").value("Sample Event 2"))
				.andExpect(jsonPath("$[1].description").value("Sample Event Description 2"));
	}

	@Test
	@WithMockUser(authorities = "EDUCATOR")
	public void testEducatorShouldUpdateEventMaterial() throws Exception {
		// Create a sample event to use its ID in the API request
		Event event = new Event();
		event.setName("Sample Event");
		event.setDescription("Sample Event Description");
		event.setMaterials("Sample Material");
		eventRepository.save(event);

		// Create an update event object for the request body
		Event updateEvent = new Event();
		updateEvent.setName("Updated Sample Event");
		updateEvent.setMaterials("Updated Material");

		// Convert the update event object to JSON
		String updateEventJson = objectMapper.writeValueAsString(updateEvent);

		// Perform the API request using MockMvc
		mockMvc.perform(MockMvcRequestBuilders.put("/api/educator/update-material/{eventId}", event.getId())
						.content(updateEventJson)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.name").value("Updated Sample Event"))
				.andExpect(jsonPath("$.materials").value("Updated Material"));

		// Verify that the event is updated in the database
		Event updatedEvent = eventRepository.findById(event.getId()).orElse(null);
		assertNotNull(updatedEvent);
		assertEquals(updateEvent.getName(), updatedEvent.getName());
		assertEquals(updateEvent.getMaterials(), updatedEvent.getMaterials());
	}


	@Test
	@WithMockUser(authorities = "STUDENT")
	public void testStudentShouldRegisterForEvent() throws Exception {
		User student = new User();
		student.setUsername("student1");
		student.setPassword("password");
		student.setRole("STUDENT");
		student.setEmail("student@gmail.com");
		student = userRepository.save(student);

		Event event = new Event();
		event.setName("Sample Event");
		event.setDescription("Sample Event Description");
		event = eventRepository.save(event);

		// Create a registration object for the request body
		EventRegistration registration = new EventRegistration();
		registration.setStudentId(student.getId());

		// Convert the registration object to JSON
		String registrationJson = objectMapper.writeValueAsString(registration);

		// Perform the API request using MockMvc
		mockMvc.perform(MockMvcRequestBuilders.post("/api/student/register/{eventId}", event.getId())
						.content(registrationJson)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").exists());

		// Verify that the registration is saved in the database
		EventRegistration savedRegistration = eventRegistrationRepository.findAll().get(0);
		assertNotNull(savedRegistration);
		assertEquals(event.getId(), savedRegistration.getEvent().getId());
		assertEquals(student.getId(), savedRegistration.getStudentId());
	}

	@Test
	@WithMockUser(authorities = "STUDENT")
	public void testStudentShouldViewRegistrationStatus() throws Exception {

		User student = new User();
		student.setUsername("student1");
		student.setPassword("password");
		student.setRole("STUDENT");
		student.setEmail("student@gmail.com");
		student = userRepository.save(student);

		// Create a sample event and registration in the database
		Event event = new Event();
		event.setName("Sample Event");
		event.setDescription("Sample Event Description");
		event = eventRepository.save(event);


		EventRegistration registration = new EventRegistration();
		registration.setEvent(event);
		registration.setStudentId(student.getId());
		registration.setStatus("REGISTERED");
		eventRegistrationRepository.save(registration);

		// Perform the API request using MockMvc
		mockMvc.perform(MockMvcRequestBuilders.get("/api/student/registration-status/{studentId}", student.getId())
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$[0].status").value("REGISTERED"))
				.andExpect(jsonPath("$[0].event.name").value("Sample Event"))
				.andExpect(jsonPath("$[0].event.description").value("Sample Event Description"));
	}

	@Test
	@WithMockUser(authorities = {"EDUCATOR", "STUDENT"})
	public void testEducatorAndStudentShouldNotAccessInstitutionApi() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.post("/api/institution/event")
						.content("")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isForbidden());

		mockMvc.perform(MockMvcRequestBuilders.get("/api/institution/events")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isForbidden());

		mockMvc.perform(MockMvcRequestBuilders.post("/api/institution/resource")
						.content("")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isForbidden());

		mockMvc.perform(MockMvcRequestBuilders.get("/api/institution/resources")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isForbidden());

		mockMvc.perform(MockMvcRequestBuilders.post("/api/institution/event/allocate-resources")
						.param("eventId", "1")
						.param("resourceId", "1")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isForbidden());

	}

	@Test
	@WithMockUser(authorities = {"INSTITUTION", "STUDENT"})
	public void testInstitutionAndStudentShouldNotAccessEducatorApi() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/api/educator/agenda")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isForbidden());

		mockMvc.perform(MockMvcRequestBuilders.put("/api/educator/update-material/{eventId}", 1)
						.content("")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isForbidden());

	}

	@Test
	@WithMockUser(authorities = {"INSTITUTION", "EDUCATOR"})
	public void testInstitutionAndEducatorShouldNotAccessStudentApi() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.post("/api/student/register/{eventId}", 1)
						.content("")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isForbidden());

		mockMvc.perform(MockMvcRequestBuilders.get("/api/student/registration-status/{studentId}", 1)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isForbidden());
	}


}
