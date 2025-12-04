package com.taskgenie.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskgenie.model.AiLog;
import com.taskgenie.model.User;
import com.taskgenie.repository.AiLogRepository;
import com.taskgenie.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AiService {

  private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

  private final WebClient webClient;

  @Autowired
  private AiLogRepository aiLogRepository;

  @Autowired
  private UserRepository userRepository;

  @Value("${groq.api.key}")
  private String groqApiKey;

  public AiService(WebClient webClient) {
    this.webClient = webClient;
  }

  public String generate(UUID userId, String prompt) {
    String requestJson = """
      {
        "model": "llama-3.1-8b-instant",
        "messages": [
          {
            "role": "user",
            "content": "%s"
          }
        ]
      }
      """.formatted(prompt);

    String aiResponse;
    try {
      Mono<String> responseMono = webClient
        .post()
        .uri("https://api.groq.com/openai/v1/chat/completions")
        .header("Authorization", "Bearer " + groqApiKey)
        .header("Content-Type", "application/json")
        .header("Accept", "application/json")
        .bodyValue(requestJson)
        .retrieve()
        .bodyToMono(String.class);

      String response = responseMono.block();
      aiResponse = extractContent(response);
    } catch (org.springframework.web.reactive.function.client.WebClientResponseException responseException) {
      aiResponse = "Groq API Error: The Groq server returned "
        + responseException.getStatusCode().value()
        + ". Please verify your Groq API key, request model and check Groq dashboard. Details: "
        + responseException.getResponseBodyAsString();
    } catch (Exception exception) {
      aiResponse = "Groq API Error: Please check your internet connection, Groq API key configuration, or try again in a few minutes. Details: "
        + exception.getMessage();
    }

    saveAiLog(userId, prompt, aiResponse);
    return aiResponse;
  }

  private void saveAiLog(UUID userId, String prompt, String aiResponse) {
    try {
      Optional<User> userOptional = userRepository.findById(userId);
      if (userOptional.isPresent()) {
        AiLog aiLog = new AiLog();
        aiLog.setUser(userOptional.get());
        aiLog.setPrompt(prompt);
        aiLog.setAiResponse(aiResponse);
        aiLogRepository.save(aiLog);
      }
    } catch (Exception exception) {
      // Log error but don't fail the request if logging fails
      System.err.println("Failed to save AI log: " + exception.getMessage());
    }
  }

  public List<AiLog> getAiLogs(UUID userId) {
    Optional<User> userOptional = userRepository.findById(userId);
    if (userOptional.isEmpty()) {
      throw new RuntimeException("User not found. Please verify the user ID and try again.");
    }
    return aiLogRepository.findByUser(userOptional.get());
  }

  private String extractContent(String json) {
    if (json == null || json.isEmpty()) {
      return "Groq API Error: Received empty response. Please retry or check Groq dashboard status.";
    }

    try {
      JsonNode root = OBJECT_MAPPER.readTree(json);
      JsonNode choices = root.path("choices");
      if (!choices.isArray() || choices.isEmpty()) {
        return json;
      }

      JsonNode contentNode = choices
        .get(0)
        .path("message")
        .path("content");

      if (contentNode.isMissingNode() || contentNode.isNull()) {
        return json;
      }

      return contentNode.asText().trim();
    } catch (Exception parseException) {
      // Fallback: return original JSON if parsing fails so caller can still see full details
      return json;
    }
  }
}

