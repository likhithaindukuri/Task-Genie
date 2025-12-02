package com.taskgenie.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class AiService {

  private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

  private final WebClient webClient;

  @Value("${groq.api.key}")
  private String groqApiKey;

  public AiService(WebClient webClient) {
    this.webClient = webClient;
  }

  public String generate(String prompt) {
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
      return extractContent(response);
    } catch (org.springframework.web.reactive.function.client.WebClientResponseException responseException) {
      return "Groq API Error: The Groq server returned "
        + responseException.getStatusCode().value()
        + ". Please verify your Groq API key, request model and check Groq dashboard. Details: "
        + responseException.getResponseBodyAsString();
    } catch (Exception exception) {
      return "Groq API Error: Please check your internet connection, Groq API key configuration, or try again in a few minutes. Details: "
        + exception.getMessage();
    }
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

