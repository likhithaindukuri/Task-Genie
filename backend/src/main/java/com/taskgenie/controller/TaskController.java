package com.taskgenie.controller;

import com.taskgenie.model.Task;
import com.taskgenie.service.TaskService;

import org.springframework.beans.factory.annotation.Autowired;
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

  @PostMapping("/{userId}")
  public Task createTask(@PathVariable UUID userId, @RequestBody Task task) {
    return taskService.createTask(userId, task);
  }

  @GetMapping("/{userId}")
  public List<Task> getTasks(@PathVariable UUID userId) {
    return taskService.getTasks(userId);
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


