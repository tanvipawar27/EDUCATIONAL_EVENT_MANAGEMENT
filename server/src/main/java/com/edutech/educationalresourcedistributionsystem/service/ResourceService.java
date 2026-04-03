package com.edutech.educationalresourcedistributionsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.educationalresourcedistributionsystem.entity.Resource;
import com.edutech.educationalresourcedistributionsystem.repository.ResourceRepository;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ResourceService {

    private static final Logger logger = LoggerFactory.getLogger(ResourceService.class);

    @Autowired
    private ResourceRepository resourceRepository;

    public Resource createResource(Resource resource) {
        logger.info("Creating new resource of type: {}", resource.getResourceType());
        Resource saved = resourceRepository.save(resource);
        logger.info("Resource created successfully with ID: {}", saved.getId());
        return saved;
    }

    public List<Resource> getAllResources() {
        logger.info("Fetching all resources...");
        List<Resource> resources = resourceRepository.findAll();
        logger.debug("Number of resources fetched: {}", resources.size());
        return resources;
    }
}
