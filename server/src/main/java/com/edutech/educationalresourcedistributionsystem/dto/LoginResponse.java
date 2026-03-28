package com.edutech.educationalresourcedistributionsystem.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;


















public class LoginResponse {
private String token;
private String role;
private Long id;

public LoginResponse(String token, String role, Long id) {
this.token = token;
this.role = role;
this.id = id;
}

public String getToken() { return token; }
public void setToken(String token) { this.token = token; }

public String getRole() { return role; }
public void setRole(String role) { this.role = role; }

public Long getId() { return id; }
public void setId(Long id) { this.id = id; }
}