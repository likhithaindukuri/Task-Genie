package com.taskgenie.controller;

import com.taskgenie.model.User;
import com.taskgenie.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

  @Autowired
  private UserService userService;

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody User user) {
    try {
      User registeredUser = userService.registerUser(user);
      return ResponseEntity.ok(registeredUser);
    } catch (RuntimeException e) {
      Map<String, String> error = new HashMap<>();
      error.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
    try {
      String email = loginRequest.get("email");
      String password = loginRequest.get("password");
      
      if (email == null || password == null) {
        Map<String, String> error = new HashMap<>();
        error.put("message", "Email and password are required");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
      }
      
      String token = userService.loginUser(email, password);
      Map<String, String> response = new HashMap<>();
      response.put("token", token);
      return ResponseEntity.ok(response);
    } catch (RuntimeException e) {
      Map<String, String> error = new HashMap<>();
      error.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
  }
}


