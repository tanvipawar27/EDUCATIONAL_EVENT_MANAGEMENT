package com.edutech.educationalresourcedistributionsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.edutech.educationalresourcedistributionsystem.dto.LoginRequest;
import com.edutech.educationalresourcedistributionsystem.dto.LoginResponse;
import com.edutech.educationalresourcedistributionsystem.entity.User;
import com.edutech.educationalresourcedistributionsystem.jwt.JwtUtil;
import com.edutech.educationalresourcedistributionsystem.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class RegisterAndLoginController {

    private static final Logger logger = LoggerFactory.getLogger(RegisterAndLoginController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        logger.info("Register request received for username: {}", user.getUsername());
        User registeredUser = userService.registerUser(user);
        logger.info("User registered successfully with ID: {}", registeredUser.getId());
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        logger.info("Login attempt for username: {}", loginRequest.getUsername());
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            UserDetails userDetails = userService.loadUserByUsername(loginRequest.getUsername());
            String token = jwtUtil.generateToken(userDetails);
            User user = userService.getUserByUsername(loginRequest.getUsername());
            logger.info("Login successful for username: {}", user.getUsername());
            LoginResponse response = new LoginResponse(token, user.getUsername(), user.getRole());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (AuthenticationException e) {
            logger.error("Login failed for username: {} - {}", loginRequest.getUsername(), e.getMessage());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password", e);
        }
    }
}

// package com.edutech.educationalresourcedistributionsystem.controller;


// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.AuthenticationException;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.ResponseStatus;
// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.server.ResponseStatusException;

// import com.edutech.educationalresourcedistributionsystem.dto.LoginRequest;
// import com.edutech.educationalresourcedistributionsystem.dto.LoginResponse;
// import com.edutech.educationalresourcedistributionsystem.entity.User;
// import com.edutech.educationalresourcedistributionsystem.jwt.JwtUtil;
// import com.edutech.educationalresourcedistributionsystem.service.UserService;


// @RestController
// @RequestMapping("/api/user")
// @CrossOrigin(origins = "*")
// public class RegisterAndLoginController {

//     @Autowired
//     private UserService userService;

//     @Autowired
//     private AuthenticationManager authenticationManager;

//     @Autowired
//     private JwtUtil jwtUtil;

//     @PostMapping("/register")
//     public ResponseEntity<User> registerUser(@RequestBody User user) {
//         User registeredUser = userService.registerUser(user);
//         return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
//     }

//     @PostMapping("/login")
//     public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
//         try {
//             authenticationManager.authenticate(
//                 new UsernamePasswordAuthenticationToken(
//                     loginRequest.getUsername(),
//                     loginRequest.getPassword()
//                 )
//             );
//             UserDetails userDetails = userService.loadUserByUsername(loginRequest.getUsername());
//             String token = jwtUtil.generateToken(userDetails);
//             User user = userService.getUserByUsername(loginRequest.getUsername());
//             LoginResponse response = new LoginResponse(token, user.getUsername(), user.getRole());
//             return new ResponseEntity<>(response, HttpStatus.OK);
//         } catch (AuthenticationException e) {
//             throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password", e);
//         }
//     }
// }
