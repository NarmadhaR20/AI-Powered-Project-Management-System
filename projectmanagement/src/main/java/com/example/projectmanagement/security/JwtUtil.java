package com.example.projectmanagement.security;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    // MUST be at least 32 characters
    private static final String SECRET_KEY =
            "my-super-secret-key-for-jwt-signing-12345";

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // ✅ GENERATE TOKEN (CORRECT)
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1 hour
                .signWith(key, SignatureAlgorithm.HS256) // ✅ SAME KEY
                .compact();
    }

    // ✅ EXTRACT USERNAME
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // ✅ EXTRACT ROLE
    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    // ✅ VALIDATE TOKEN
    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // ✅ PARSE CLAIMS
    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
