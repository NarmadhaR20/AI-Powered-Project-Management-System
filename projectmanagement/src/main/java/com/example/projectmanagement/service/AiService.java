package com.example.projectmanagement.service;

import com.example.projectmanagement.dto.TaskSuggestionDto;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AiService {

    @org.springframework.beans.factory.annotation.Autowired
    private com.example.projectmanagement.repository.TaskRepository taskRepository;

    public List<TaskSuggestionDto> generateTasks(String prompt) {
        // Smart Task Creation Logic
        List<TaskSuggestionDto> tasks = new ArrayList<>();
        String lowerPrompt = prompt.toLowerCase();

        // 1. Direct "Create a task..." command parsing
        if (lowerPrompt.startsWith("create") || lowerPrompt.contains("priority")) {
            tasks.add(parseSingleSmartTask(prompt));
            return tasks;
        }

        // 2. Fallback to Project Generation (Multiple Tasks)
        // ... (existing logic adapted to DTOs)
        if (lowerPrompt.contains("website") || lowerPrompt.contains("app")) {
            tasks.add(new TaskSuggestionDto("Design User Interface (UI/UX)", "MEDIUM", null, null));
            tasks.add(new TaskSuggestionDto("Setup Database Schema", "HIGH", null, null));
            tasks.add(new TaskSuggestionDto("Implement Authentication", "HIGH", null, null));
            tasks.add(new TaskSuggestionDto("Frontend Integration", "MEDIUM", null, null));
        } else {
            tasks.add(new TaskSuggestionDto("Define Project Scope", "HIGH", null, null));
            tasks.add(new TaskSuggestionDto("Kickoff Meeting", "MEDIUM", null, LocalDate.now().plusDays(1)));
        }

        return tasks;
    }

    public com.example.projectmanagement.dto.ChatResponse chatWithProject(String message, Long projectId) {
        List<com.example.projectmanagement.entity.Task> tasks = taskRepository.findByProjectId(projectId);
        String lowerMsg = message.toLowerCase();

        long totalTasks = tasks.size();
        long completed = tasks.stream().filter(t -> "DONE".equalsIgnoreCase(t.getStatus())).count();
        long highPriority = tasks.stream().filter(t -> "HIGH".equalsIgnoreCase(t.getPriority())).count();

        if (lowerMsg.contains("how many tasks") || lowerMsg.contains("total tasks")) {
            return new com.example.projectmanagement.dto.ChatResponse(
                    "There are " + totalTasks + " tasks in this project (" + completed + " completed).");
        }

        if (lowerMsg.contains("high priority")) {
            if (highPriority == 0)
                return new com.example.projectmanagement.dto.ChatResponse("No high priority tasks found.");

            StringBuilder sb = new StringBuilder("Found " + highPriority + " high priority tasks: ");
            tasks.stream()
                    .filter(t -> "HIGH".equalsIgnoreCase(t.getPriority()))
                    .limit(5)
                    .forEach(t -> sb.append(t.getTitle()).append(", "));
            return new com.example.projectmanagement.dto.ChatResponse(sb.toString());
        }

        if (lowerMsg.contains("assigned to")) {
            // "assigned to John"
            String assigneeName = lowerMsg.substring(lowerMsg.indexOf("assigned to") + 11).trim();
            List<String> assignedTasks = tasks.stream()
                    .filter(t -> t.getAssignees().stream()
                            .anyMatch(u -> u.getName().toLowerCase().contains(assigneeName)))
                    .map(com.example.projectmanagement.entity.Task::getTitle)
                    .collect(java.util.stream.Collectors.toList());

            if (assignedTasks.isEmpty()) {
                return new com.example.projectmanagement.dto.ChatResponse("No tasks assigned to " + assigneeName);
            }
            return new com.example.projectmanagement.dto.ChatResponse(
                    "Tasks for " + assigneeName + ": " + String.join(", ", assignedTasks));
        }

        return new com.example.projectmanagement.dto.ChatResponse(
                "I can help! Ask me 'How many tasks?', 'Show high priority tasks', or 'Tasks assigned to [Name]'.");
    }

    public com.example.projectmanagement.dto.SprintSummaryDto generateSprintSummary(Long projectId) {
        List<com.example.projectmanagement.entity.Task> tasks = taskRepository.findByProjectId(projectId);

        long total = tasks.size();
        long completed = tasks.stream().filter(t -> "DONE".equalsIgnoreCase(t.getStatus())).count();
        long pending = total - completed;

        // 1. Identify Risks
        List<String> risks = new ArrayList<>();
        long highPriorityPending = tasks.stream()
                .filter(t -> !"DONE".equalsIgnoreCase(t.getStatus()) && "HIGH".equalsIgnoreCase(t.getPriority()))
                .count();

        if (highPriorityPending > 0) {
            risks.add(highPriorityPending + " High Priority tasks are still pending.");
        }

        long overdue = tasks.stream()
                .filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(LocalDate.now())
                        && !"DONE".equalsIgnoreCase(t.getStatus()))
                .count();

        if (overdue > 0) {
            risks.add(overdue + " tasks are overdue.");
        }

        if (risks.isEmpty()) {
            risks.add("No immediate risks detected. Keep it up!");
        }

        // 2. Analyze Morale (Mock implementation for now, will be real with Sentiment
        // Analysis)
        String morale = "Positive";

        // 3. Generate AI Analysis Text
        StringBuilder analysis = new StringBuilder();
        if (completed > total / 2) {
            analysis.append("The team is making great progress! Over 50% of tasks are completed. ");
        } else {
            analysis.append("The team is in the early stages or facing some blocks. ");
        }

        if (highPriorityPending > 2) {
            analysis.append("Attention is needed on high priority items. ");
        } else {
            analysis.append("Priority management looks good. ");
        }

        return new com.example.projectmanagement.dto.SprintSummaryDto(
                total, completed, pending, risks, morale, analysis.toString());
    }

    private TaskSuggestionDto parseSingleSmartTask(String prompt) {
        String lower = prompt.toLowerCase();

        // Default values
        String title = prompt;
        String priority = "LOW";
        String assignee = null;
        LocalDate dueDate = null;

        // Extract Priority
        if (lower.contains("high priority") || lower.contains("critical"))
            priority = "HIGH";
        else if (lower.contains("medium priority"))
            priority = "MEDIUM";

        // Extract Assignee ("for [Name]")
        Pattern assigneePattern = Pattern.compile("for\\s+([A-Za-z]+)", Pattern.CASE_INSENSITIVE);
        Matcher assigneeMatcher = assigneePattern.matcher(prompt);
        if (assigneeMatcher.find()) {
            assignee = assigneeMatcher.group(1);
        }

        // Extract Due Date ("by [Day]")
        if (lower.contains("by friday")) {
            dueDate = LocalDate.now().with(TemporalAdjusters.nextOrSame(DayOfWeek.FRIDAY));
        } else if (lower.contains("by monday")) {
            dueDate = LocalDate.now().with(TemporalAdjusters.nextOrSame(DayOfWeek.MONDAY));
        } else if (lower.contains("tomorrow")) {
            dueDate = LocalDate.now().plusDays(1);
        }

        // Clean up Title (remove "create a task...", "high priority", "for john", "by
        // friday")
        title = prompt.replaceAll(
                "(?i)(create a|task|high priority|medium priority|low priority|for\\s+[a-z]+|by\\s+[a-z]+)", "").trim();
        // Capitalize first letter
        if (title.length() > 0) {
            title = title.substring(0, 1).toUpperCase() + title.substring(1);
        } else {
            title = "New Task";
        }

        return new TaskSuggestionDto(title, priority, assignee, dueDate);
    }
}
