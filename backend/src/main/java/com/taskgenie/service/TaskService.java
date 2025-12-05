package com.taskgenie.service;

import com.taskgenie.model.Task;
import com.taskgenie.model.User;
import com.taskgenie.repository.TaskRepository;
import com.taskgenie.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskService {

  @Autowired
  private TaskRepository taskRepository;

  @Autowired
  private UserRepository userRepository;

  public Task createTask(UUID userId, Task task) {
    Optional<User> user = userRepository.findById(userId);
    if (user.isEmpty()) {
      throw new RuntimeException("User not found!");
    }
    task.setUser(user.get());
    return taskRepository.save(task);
  }

  public List<Task> getTasks(UUID userId) {
    Optional<User> user = userRepository.findById(userId);
    if (user.isEmpty()) {
      throw new RuntimeException("User not found!");
    }
    return taskRepository.findByUser(user.get());
  }

  public Task updateTask(UUID userId, UUID taskId, Task updatedTask) {
    Optional<Task> existingTask = taskRepository.findById(taskId);
    if (existingTask.isEmpty()) {
      throw new RuntimeException("Task not found!");
    }
    Task task = existingTask.get();
    // Verify task belongs to the user
    if (!task.getUser().getId().equals(userId)) {
      throw new RuntimeException("Unauthorized: You can only update your own tasks");
    }
    task.setTitle(updatedTask.getTitle());
    task.setDescription(updatedTask.getDescription());
    task.setCategory(updatedTask.getCategory());
    task.setPriority(updatedTask.getPriority());
    task.setStatus(updatedTask.getStatus());
    task.setDueDate(updatedTask.getDueDate());
    return taskRepository.save(task);
  }

  public void deleteTask(UUID userId, UUID taskId) {
    Optional<Task> task = taskRepository.findById(taskId);
    if (task.isEmpty()) {
      throw new RuntimeException("Task not found!");
    }
    // Verify task belongs to the user
    if (!task.get().getUser().getId().equals(userId)) {
      throw new RuntimeException("Unauthorized: You can only delete your own tasks");
    }
    taskRepository.delete(task.get());
  }
}


