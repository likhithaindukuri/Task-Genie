package com.taskgenie.service;

import com.taskgenie.model.User;
import com.taskgenie.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;

  public User registerUser(User user) {
    Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
    if (existingUser.isPresent()) {
      throw new RuntimeException("Email already exists!");
    }
    return userRepository.save(user);
  }

  public User loginUser(String email, String password) {
    Optional<User> user = userRepository.findByEmail(email);
    if (user.isEmpty()) {
      throw new RuntimeException("User not found!");
    }
    if (!user.get().getPassword().equals(password)) {
      throw new RuntimeException("Incorrect password!");
    }
    return user.get();
  }
}


