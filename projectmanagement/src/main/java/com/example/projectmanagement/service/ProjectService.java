package com.example.projectmanagement.service;

import com.example.projectmanagement.entity.Project;
import com.example.projectmanagement.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private com.example.projectmanagement.repository.OrganizationRepository organizationRepository;

    public List<Project> getProjectsByOrganization(Long organizationId) {
        return projectRepository.findByOrganizationId(organizationId);
    }

    public Project createProject(Long organizationId, Project project) {
        com.example.projectmanagement.entity.Organization org = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        project.setOrganization(org);
        return projectRepository.save(project);
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
    }
}
