package com.taskgenie.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

  @Value("${jwt.secret}")
  private String jwtSecret;

  @Value("${jwt.expiration-ms}")
  private long jwtExpirationMs;

  private Key getSigningKey() {
    // Ensure secret is at least 32 bytes (256 bits) for HS256
    byte[] keyBytes = jwtSecret.getBytes();
    if (keyBytes.length < 32) {
      throw new IllegalArgumentException("JWT secret must be at least 32 characters long");
    }
    return Keys.hmacShaKeyFor(keyBytes);
  }

  public String generateToken(String userId, String email) {
    Date now = new Date();
    Date exp = new Date(now.getTime() + jwtExpirationMs);
    return Jwts.builder()
        .setSubject(userId)
        .claim("email", email)
        .setIssuedAt(now)
        .setExpiration(exp)
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  public String getUserId(String token) {
    Claims claims = Jwts.parserBuilder()
        .setSigningKey(getSigningKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
    return claims.getSubject();
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder()
          .setSigningKey(getSigningKey())
          .build()
          .parseClaimsJws(token);
      return true;
    } catch (JwtException ex) {
      return false;
    }
  }
}

