package com.taskgenie.controller;

import com.taskgenie.model.User;
import com.taskgenie.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

  @Autowired
  private UserService userService;

  @PostMapping("/register")
  public User register(@RequestBody User user) {
    return userService.registerUser(user);
  }

  @PostMapping("/login")
  public Map<String, String> login(@RequestBody Map<String, String> loginRequest) {
    String token = userService.loginUser(loginRequest.get("email"), loginRequest.get("password"));
    return Map.of("token", token);
  }
}


