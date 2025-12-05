package com.taskgenie.controller;

import com.taskgenie.model.Task;
import com.taskgenie.service.TaskService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

  @Autowired
  private TaskService taskService;

  @PostMapping("/")
  public Task createTask(@AuthenticationPrincipal String userId, @RequestBody Task task) {
    return taskService.createTask(UUID.fromString(userId), task);
  }

  @GetMapping("/")
  public List<Task> getTasks(@AuthenticationPrincipal String userId) {
    return taskService.getTasks(UUID.fromString(userId));
  }

  @PutMapping("/{taskId}")
  public Task updateTask(@PathVariable UUID taskId, @RequestBody Task task) {
    return taskService.updateTask(taskId, task);
  }

  @DeleteMapping("/{taskId}")
  public String deleteTask(@PathVariable UUID taskId) {
    return taskService.deleteTask(taskId);
  }
}


