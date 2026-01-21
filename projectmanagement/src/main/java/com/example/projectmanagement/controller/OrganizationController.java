package com.example.projectmanagement.controller;

import com.example.projectmanagement.entity.Organization;
import com.example.projectmanagement.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/organizations")
@CrossOrigin(origins = "http://localhost:5173")
public class OrganizationController {

    @Autowired
    private OrganizationService organizationService;

    @PostMapping
    public Organization createOrganization(@RequestBody Map<String, String> body) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return organizationService.createOrganization(body.get("name"), email);
    }

    @GetMapping
    public List<Organization> getUserOrganizations() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return organizationService.getUserOrganizations(email);
    }

    @PostMapping("/{orgId}/members")
    public void addMember(@PathVariable Long orgId, @RequestBody Map<String, String> body) {
        String emailToAdd = body.get("email");
        organizationService.addMember(orgId, emailToAdd);
    }

    @GetMapping("/{orgId}/role")
    public Map<String, String> getUserRole(@PathVariable Long orgId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String role = organizationService.getUserRoleInOrganization(orgId, email);
        return Map.of("role", role);
    }

    @GetMapping("/{orgId}/members")
    public List<com.example.projectmanagement.entity.OrganizationMember> getMembers(@PathVariable Long orgId) {
        return organizationService.getOrganizationMembers(orgId);
    }

    @PutMapping("/{orgId}/members/{userId}/role")
    public void updateMemberRole(@PathVariable Long orgId, @PathVariable Long userId,
            @RequestBody Map<String, String> body) {
        organizationService.updateMemberRole(orgId, userId, body.get("role"));
    }
}
