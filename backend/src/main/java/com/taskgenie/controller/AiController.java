package com.taskgenie.controller;

import com.taskgenie.service.AiService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

  private final AiService aiService;

  public AiController(AiService aiService) {
    this.aiService = aiService;
  }

  @PostMapping("/generate-description")
  public String generateDescription(@RequestParam String title) {
    String prompt = "Generate a detailed task description for: " + title;
    return aiService.generate(prompt);
  }

  @PostMapping("/generate-tasks")
  public String generateTasks(@RequestParam String text) {
    String prompt = "Convert this text into actionable tasks with priority: " + text;
    return aiService.generate(prompt);
  }

  @PostMapping("/summary")
  public String summarizeTasks() {
    String prompt = "Create a productivity summary for today’s tasks.";
    return aiService.generate(prompt);
  }
}


