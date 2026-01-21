package com.example.projectmanagement.controller;

import com.example.projectmanagement.entity.Project;
import com.example.projectmanagement.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping("/organization/{organizationId}")
    public List<Project> getProjects(@PathVariable Long organizationId) {
        return projectService.getProjectsByOrganization(organizationId);
    }

    @PostMapping("/organization/{organizationId}")
    public Project createProject(@PathVariable Long organizationId, @RequestBody Project project) {
        return projectService.createProject(organizationId, project);
    }
}
