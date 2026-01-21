package com.example.projectmanagement.controller;

import com.example.projectmanagement.entity.Task;
import com.example.projectmanagement.service.TaskService;
import com.example.projectmanagement.dto.LeaderboardDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/project/{projectId}")
    public List<Task> getTasksByProject(@PathVariable Long projectId) {
        return taskService.getTasksByProjectId(projectId);
    }

    @GetMapping("/project/{projectId}/leaderboard")
    public List<LeaderboardDto> getLeaderboard(@PathVariable Long projectId) {
        return taskService.getLeaderboard(projectId);
    }

    @PostMapping("/project/{projectId}")
    public Task createTask(@PathVariable Long projectId, @RequestBody Task task) {
        return taskService.createTask(projectId, task);
    }

    @PutMapping("/{taskId}/status")
    public Task updateStatus(@PathVariable Long taskId, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return taskService.updateTaskStatus(taskId, status);
    }

    @PutMapping("/{taskId}/assign/{userId}")
    public Task toggleAssignee(@PathVariable Long taskId, @PathVariable Long userId) {
        return taskService.toggleAssignee(taskId, userId);
    }

    @DeleteMapping("/{taskId}")
    public void deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
    }
}
