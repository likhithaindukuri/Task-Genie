package com.taskgenie.config;

import com.taskgenie.filter.JwtFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  private final JwtFilter jwtFilter;

  @Value("${spring.web.cors.allowed-origins:*}")
  private String allowedOrigins;

  @Value("${spring.web.cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS,PATCH}")
  private String allowedMethods;

  @Value("${spring.web.cors.allowed-headers:*}")
  private String allowedHeaders;

  public SecurityConfig(JwtFilter jwtFilter) {
    this.jwtFilter = jwtFilter;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .sessionManagement(session -> session.sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**")
            .permitAll()
            .requestMatchers("/api/users/register", "/api/users/login")
            .permitAll()
            .requestMatchers("/h2-console/**")
            .permitAll()
            .requestMatchers("/api/ai/generate-description/**", "/api/ai/generate-tasks/**", "/api/ai/summary/**", "/api/ai/logs/**")
            .permitAll()
            .requestMatchers("/api/ai/parse-task")
            .authenticated()
            .anyRequest()
            .authenticated())
        .addFilterBefore(
            jwtFilter,
            org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

    // For H2 console if used
    http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    
    // Allow all origins using pattern (works with credentials)
    configuration.addAllowedOriginPattern("*");
    configuration.setAllowCredentials(true);
    
    // Set allowed methods
    List<String> methods = Arrays.asList(allowedMethods.split(","));
    configuration.setAllowedMethods(methods);
    
    // Set allowed headers - explicitly list all needed headers
    configuration.addAllowedHeader("Authorization");
    configuration.addAllowedHeader("Content-Type");
    configuration.addAllowedHeader("X-Requested-With");
    configuration.addAllowedHeader("Accept");
    configuration.addAllowedHeader("Origin");
    configuration.addAllowedHeader("Access-Control-Request-Method");
    configuration.addAllowedHeader("Access-Control-Request-Headers");
    
    // Expose headers
    configuration.setExposedHeaders(List.of("Authorization", "Content-Type"));
    configuration.setMaxAge(3600L);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig)
      throws Exception {
    return authConfig.getAuthenticationManager();
  }
}


