package com.edutech.educationalresourcedistributionsystem.jwt;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.edutech.educationalresourcedistributionsystem.entity.User;
import com.edutech.educationalresourcedistributionsystem.repository.UserRepository;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;



@Component
public class JwtUtil {

private static final String SECRET = "educational_event_management_secret_key_2024_secure";
private static final long EXPIRATION_MS = 86400000; // 24 hours

private Key getSigningKey() {
return Keys.hmacShaKeyFor(SECRET.getBytes());
}

public String generateToken(String username, String role) {
return Jwts.builder()
.setSubject(username)
.claim("role", role)
.setIssuedAt(new Date())
.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
.signWith(getSigningKey(), SignatureAlgorithm.HS256)
.compact();
}

public String extractUsername(String token) {
return parseClaims(token).getSubject();
}

public String extractRole(String token) {
return (String) parseClaims(token).get("role");
}

public boolean validateToken(String token) {
try {
parseClaims(token);
return true;
} catch (JwtException | IllegalArgumentException e) {
return false;
}
}

private Claims parseClaims(String token) {
return Jwts.parserBuilder()
.setSigningKey(getSigningKey())
.build()
.parseClaimsJws(token)
.getBody();
}
}