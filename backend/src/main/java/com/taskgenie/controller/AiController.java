package com.taskgenie.controller;

import com.taskgenie.model.AiLog;
import com.taskgenie.service.AiService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    String prompt = "Generate a task description with exactly 5-6 simple, actionable points for: " + title + ". Use plain English only - no markdown, no bold text, no special symbols. Format as simple numbered list: 1. First point, 2. Second point, 3. Third point, etc. Each point should be one clear sentence on a new line. Keep language natural and conversational.";
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

  @PostMapping("/parse-task")
  public String parseTaskFromNaturalLanguage(
      @AuthenticationPrincipal String userId,
      @RequestParam String text
  ) {
    if (userId == null || userId.isEmpty()) {
      throw new RuntimeException("User not authenticated for AI parsing. Please login again.");
    }
    java.time.LocalDate today = java.time.LocalDate.now();
    java.time.LocalDate tomorrow = today.plusDays(1);
    String todayStr = today.toString();
    String tomorrowStr = tomorrow.toString();
    java.time.LocalDate nextWeek = today.plusDays(7);
    String nextWeekStr = nextWeek.toString();

    String prompt = "You are a task parsing assistant. Parse this natural language into JSON ONLY. " +
      "Extract: title (MANDATORY - short, clear task title, must always be provided), description (3-5 numbered points like '1. First point\\n2. Second point'), " +
      "category (Work/Personal/Health/Education/Others), dueDate (YYYY-MM-DD or null), " +
      "priority (High/Medium/Low), status (always 'Pending'). " +
      "CRITICAL: You MUST always provide a title field. If unclear, create a reasonable title based on the input. " +
      "DATE RULES (analyze the text carefully for date mentions): " +
      "- 'today' or 'today' = " + todayStr + ", " +
      "- 'tomorrow' or 'tomorrow' = " + tomorrowStr + ", " +
      "- 'next week' or 'next week' = " + nextWeekStr + ", " +
      "- 'in X days' = add X days to today, " +
      "- Specific dates like 'Jan 15', 'January 15', '15th Jan' = calculate the date in YYYY-MM-DD format, " +
      "- Days like 'Monday', 'Tuesday' = calculate next occurrence of that day, " +
      "- If no date mentioned, use null. " +
      "PRIORITY RULES (analyze urgency keywords in the text): " +
      "- High: urgent, asap, important, critical, emergency, deadline soon, must do, high priority, top priority, immediately, now, today, rush, pressing " +
      "- Medium: normal, regular, standard, moderate, default (use this if unclear or no urgency mentioned), " +
      "- Low: low priority, optional, whenever, later, not urgent, can wait, someday, no rush " +
      "CATEGORY RULES: " +
      "- Work: work, business, meeting, project, office, job, professional, client, team, deadline, presentation, conference " +
      "- Personal: personal, family, friends, home, household, shopping, personal care, vacation, trip " +
      "- Health: health, fitness, doctor, medical, exercise, gym, workout, appointment, checkup, hospital " +
      "- Education: study, learn, course, class, exam, homework, assignment, school, university, education, research " +
      "- Others: anything else " +
      "Return ONLY valid JSON, no other text, no markdown, no explanations. Format: {\"title\":\"Task title\",\"description\":\"1. Point one\\n2. Point two\",\"category\":\"Work\",\"dueDate\":\"" + tomorrowStr + "\",\"priority\":\"Medium\",\"status\":\"Pending\"}. " +
      "Text: " + text;
    return aiService.generate(UUID.fromString(userId), prompt);
  }
}


