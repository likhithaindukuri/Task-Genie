package com.taskgenie.filter;

import com.taskgenie.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtFilter extends OncePerRequestFilter {

  private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);
  private final JwtUtil jwtUtil;

  public JwtFilter(JwtUtil jwtUtil) {
    this.jwtUtil = jwtUtil;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {
    String header = request.getHeader("Authorization");
    String token = null;

    if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
      token = header.substring(7);
    }

    if (token != null) {
      try {
        if (jwtUtil.validateToken(token)) {
          String userId = jwtUtil.getUserId(token);
          UsernamePasswordAuthenticationToken auth =
              new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
          auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(auth);
          logger.debug("JWT token validated and authentication set for user: " + userId);
        } else {
          logger.warn("Invalid JWT token provided");
        }
      } catch (Exception ex) {
        // Log error but continue - let Spring Security handle unauthorized requests
        logger.error("Error processing JWT token: " + ex.getMessage());
      }
    } else {
      logger.debug("No JWT token found in request");
    }

    filterChain.doFilter(request, response);
  }
}

