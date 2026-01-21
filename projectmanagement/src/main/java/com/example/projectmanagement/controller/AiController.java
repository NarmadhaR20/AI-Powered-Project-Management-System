package com.example.projectmanagement.controller;

import com.example.projectmanagement.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/generate")
    public List<com.example.projectmanagement.dto.TaskSuggestionDto> generateTasks(
            @RequestBody Map<String, String> body) {
        String prompt = body.get("prompt");
        if (prompt == null || prompt.trim().isEmpty()) {
            throw new IllegalArgumentException("Prompt cannot be empty");
        }
        return aiService.generateTasks(prompt);
    }

    @PostMapping("/chat")
    public com.example.projectmanagement.dto.ChatResponse chat(
            @RequestBody com.example.projectmanagement.dto.ChatRequest request) {
        return aiService.chatWithProject(request.getMessage(), request.getProjectId());
    }

    @GetMapping("/summary/{projectId}")
    public com.example.projectmanagement.dto.SprintSummaryDto getSummary(@PathVariable Long projectId) {
        return aiService.generateSprintSummary(projectId);
    }
}
