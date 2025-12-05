package com.taskgenie.controller;

import com.taskgenie.model.AiLog;
import com.taskgenie.service.AiService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

  private final AiService aiService;

  public AiController(AiService aiService) {
    this.aiService = aiService;
  }

  @PostMapping("/generate-description/{userId}")
  public String generateDescription(
    @PathVariable UUID userId,
    @RequestParam String title
  ) {
    String prompt = "Generate a detailed task description with 5-6 clear, actionable points for: " + title + ". Format the response as numbered points (1, 2, 3, etc.) that are natural and clear. Each point should be a specific action item.";
    return aiService.generate(userId, prompt);
  }

  @PostMapping("/generate-tasks/{userId}")
  public String generateTasks(
    @PathVariable UUID userId,
    @RequestParam String text
  ) {
    String prompt = "Convert this text into actionable tasks with priority: " + text;
    return aiService.generate(userId, prompt);
  }

  @PostMapping("/summary/{userId}")
  public String summarizeTasks(@PathVariable UUID userId) {
    String prompt = "Create a productivity summary for today's tasks.";
    return aiService.generate(userId, prompt);
  }

  @GetMapping("/logs/{userId}")
  public List<AiLog> getAiLogs(@PathVariable UUID userId) {
    return aiService.getAiLogs(userId);
  }
}


