package com.edutech.educationalresourcedistributionsystem.service;
 
import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.*;

import org.springframework.stereotype.Service;

import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service

public class ChatService{
 
    @Value("${gemini.api.key}")

    private String apiKey;
 
    @Value("${gemini.api.url}")

    private String apiUrl;
 
    public String getChatResponse(String userMessage) {

        RestTemplate restTemplate = new RestTemplate();
 
        Map<String, Object> requestBody = Map.of(

            "contents", List.of(

                Map.of("parts", List.of(

                    Map.of("text", userMessage)

                ))

            )

        );
 
        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);

        headers.add("x-goog-api-key", apiKey);
 
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
 
        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);
 
        // Parse Gemini response

        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");

        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");

        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");

        return (String) parts.get(0).get("text");

    }

}

