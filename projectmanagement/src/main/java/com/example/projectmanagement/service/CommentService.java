package com.example.projectmanagement.service;

import com.example.projectmanagement.entity.Comment;
import com.example.projectmanagement.entity.Task;
import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.repository.CommentRepository;
import com.example.projectmanagement.repository.TaskRepository;
import com.example.projectmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public Comment addComment(Long taskId, String userEmail, String text) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setText(text);
        comment.setTask(task);
        comment.setAuthor(user);
        comment.setSentiment(analyzeSentiment(text));

        return commentRepository.save(comment);
    }

    private String analyzeSentiment(String text) {
        if (text == null || text.isBlank())
            return "NEUTRAL";

        String lowerText = text.toLowerCase();

        // Positive keywords
        List<String> positiveWords = List.of("great", "good", "excellent", "done", "fixed", "awesome", "perfect",
                "success", "thanks", "wow", "amazing");
        // Negative keywords
        List<String> negativeWords = List.of("bad", "error", "bug", "blocked", "fail", "issue", "worst", "slow",
                "wrong", "broken", "help", "problem");

        long posCount = positiveWords.stream().filter(lowerText::contains).count();
        long negCount = negativeWords.stream().filter(lowerText::contains).count();

        if (posCount > negCount)
            return "POSITIVE";
        if (negCount > posCount)
            return "NEGATIVE";
        return "NEUTRAL";
    }

    public List<Comment> getComments(Long taskId) {
        return commentRepository.findByTaskId(taskId);
    }
}
