package com.taskgenie.service;

import com.taskgenie.model.User;
import com.taskgenie.repository.UserRepository;
import com.taskgenie.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private JwtUtil jwtUtil;

  public User registerUser(User user) {
    Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
    if (existingUser.isPresent()) {
      throw new RuntimeException("Email already exists!");
    }
    // Hash password
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    return userRepository.save(user);
  }

  public String loginUser(String email, String password) {
    Optional<User> user = userRepository.findByEmail(email);
    if (user.isEmpty()) {
      throw new RuntimeException("User not found!");
    }
    if (!passwordEncoder.matches(password, user.get().getPassword())) {
      throw new RuntimeException("Incorrect password!");
    }
    // Generate JWT
    return jwtUtil.generateToken(user.get().getId().toString(), user.get().getEmail());
  }
}


