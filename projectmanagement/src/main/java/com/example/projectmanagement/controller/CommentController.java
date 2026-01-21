package com.example.projectmanagement.controller;

import com.example.projectmanagement.entity.Comment;
import com.example.projectmanagement.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/task/{taskId}")
    public List<Comment> getTaskComments(@PathVariable Long taskId) {
        return commentService.getComments(taskId);
    }

    @PostMapping("/task/{taskId}")
    public Comment addComment(@PathVariable Long taskId, @RequestBody Map<String, String> body) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String text = body.get("text");
        return commentService.addComment(taskId, email, text);
    }
}
