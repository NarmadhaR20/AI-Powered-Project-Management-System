package com.example.projectmanagement.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.projectmanagement.dto.AssignRequest;
import com.example.projectmanagement.entity.ProjectUser;
import com.example.projectmanagement.repository.ProjectUserRepository;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {

    private final ProjectUserRepository projectUserRepo;

    public ManagerController(ProjectUserRepository projectUserRepo) {
        this.projectUserRepo = projectUserRepo;
    }

    @PostMapping("/assign")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN','OWNER')")
    public String assignProject(@RequestBody AssignRequest req) {

        if(req.getProjectId() == null || req.getUserId() == null){
            throw new RuntimeException("Invalid request");
        }

        ProjectUser pu = new ProjectUser();
        pu.setProjectId(req.getProjectId());
        pu.setUserId(req.getUserId());

        projectUserRepo.save(pu);

        return "Assigned successfully";
    }
}
