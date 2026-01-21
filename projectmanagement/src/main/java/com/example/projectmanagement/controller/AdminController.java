package com.example.projectmanagement.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository repo;

    public AdminController(UserRepository repo) {
        this.repo = repo;
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    @PutMapping("/promote")
    public String promote(@RequestParam String email,
                           @RequestParam String role) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        role = role.toUpperCase();

        if(!List.of("USER","GUEST","MANAGER","ADMIN","OWNER").contains(role)){
            throw new RuntimeException("Invalid role");
        }

        user.setRole(role);
        repo.save(user);

        return "Role updated to " + role;
    }
}
