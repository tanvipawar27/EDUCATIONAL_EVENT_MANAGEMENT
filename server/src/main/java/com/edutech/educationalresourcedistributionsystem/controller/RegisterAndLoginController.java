package com.edutech.educationalresourcedistributionsystem.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.edutech.educationalresourcedistributionsystem.dto.LoginRequest;
import com.edutech.educationalresourcedistributionsystem.dto.LoginResponse;
import com.edutech.educationalresourcedistributionsystem.entity.User;
import com.edutech.educationalresourcedistributionsystem.jwt.JwtUtil;
import com.edutech.educationalresourcedistributionsystem.service.UserService;


@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class RegisterAndLoginController {
   @Autowired
   private UserService userService;
   @Autowired
   private AuthenticationManager authenticationManager;
   @Autowired
   private JwtUtil jwtUtil;
   @PostMapping("/register")
   @ResponseStatus(HttpStatus.CREATED)
   public ResponseEntity<User> registerUser(@RequestBody User user) {
       User saved = userService.registerUser(user);
       return ResponseEntity.status(HttpStatus.CREATED).body(saved);
   }
   @PostMapping("/login")
   public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
       try {
           authenticationManager.authenticate(
                   new UsernamePasswordAuthenticationToken(
                           loginRequest.getUsername(),
                           loginRequest.getPassword()
                   )
           );
           User user = userService.getUserByUsername(loginRequest.getUsername());
           String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
           return ResponseEntity.ok(new LoginResponse(token, user.getRole(), user.getId()));
       } catch (AuthenticationException e) {
           throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password", e);
       }
   }
}