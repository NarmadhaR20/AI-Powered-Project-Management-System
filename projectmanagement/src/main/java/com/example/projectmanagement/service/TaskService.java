package com.example.projectmanagement.service;

import com.example.projectmanagement.entity.Project;
import com.example.projectmanagement.entity.Task;
import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.repository.ProjectRepository;
import com.example.projectmanagement.repository.TaskRepository;
import com.example.projectmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import com.example.projectmanagement.dto.LeaderboardDto;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Task> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public Task createTask(Long projectId, Task task) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        task.setProject(project);
        if (task.getStatus() == null) {
            task.setStatus("BACKLOG");
        }
        if (task.getPriority() == null) {
            task.setPriority("LOW");
        }
        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Long taskId, String status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);
        return taskRepository.save(task);
    }

    public Task toggleAssignee(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<User> assignees = task.getAssignees();
        if (assignees.contains(user)) {
            assignees.remove(user);
        } else {
            assignees.add(user);
        }
        task.setAssignees(assignees);
        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    public List<LeaderboardDto> getLeaderboard(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        Map<String, LeaderboardDto> userStats = new HashMap<>();

        for (Task task : tasks) {
            if ("DONE".equalsIgnoreCase(task.getStatus())) {
                for (User user : task.getAssignees()) {
                    LeaderboardDto dto = userStats.computeIfAbsent(user.getEmail(),
                            email -> new LeaderboardDto(user.getName(), email, 0, 0));

                    dto.setCompletedTasks(dto.getCompletedTasks() + 1);

                    long taskScore = 10; // Base points
                    if ("HIGH".equalsIgnoreCase(task.getPriority()))
                        taskScore += 10;
                    else if ("MEDIUM".equalsIgnoreCase(task.getPriority()))
                        taskScore += 5;

                    dto.setScore(dto.getScore() + taskScore);
                }
            }
        }

        return userStats.values().stream()
                .sorted((a, b) -> Long.compare(b.getScore(), a.getScore()))
                .collect(Collectors.toList());
    }
}
