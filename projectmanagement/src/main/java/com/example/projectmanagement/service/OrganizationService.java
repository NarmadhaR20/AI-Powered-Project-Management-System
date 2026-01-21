package com.example.projectmanagement.service;

import com.example.projectmanagement.entity.Organization;
import com.example.projectmanagement.entity.OrganizationMember;
import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.repository.OrganizationMemberRepository;
import com.example.projectmanagement.repository.OrganizationRepository;
import com.example.projectmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
public class OrganizationService {

        @Autowired
        private OrganizationRepository organizationRepository;

        @Autowired
        private OrganizationMemberRepository organizationMemberRepository;

        @Autowired
        private UserRepository userRepository;

        @Transactional
        public Organization createOrganization(String name, String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                Organization org = new Organization();
                org.setName(name);
                org.setCode(UUID.randomUUID().toString());
                org.setOwnerId(user.getId());
                org = organizationRepository.save(org);
                OrganizationMember member = new OrganizationMember();
                member.setOrganization(org);
                member.setUser(user);
                member.setRole("OWNER");
                organizationMemberRepository.save(member);
                return org;
        }
        public List<Organization> getUserOrganizations(String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<OrganizationMember> memberships = organizationMemberRepository.findByUserId(user.getId());
                return memberships.stream()
                                .map(OrganizationMember::getOrganization)
                                .collect(Collectors.toList());
        }
        @Transactional
        public void addMember(Long organizationId, String userEmail) {
                Organization org = organizationRepository.findById(organizationId)
                                .orElseThrow(() -> new RuntimeException("Organization not found"));

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

                // Check if already member
                if (organizationMemberRepository.findByUserIdAndOrganizationId(user.getId(), org.getId()).isPresent()) {
                        throw new RuntimeException("User is already a member");
                }

                OrganizationMember member = new OrganizationMember();
                member.setOrganization(org);
                member.setUser(user);
                member.setRole("MEMBER"); // Default role
                organizationMemberRepository.save(member);
        }

        public String getUserRoleInOrganization(Long orgId, String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return organizationMemberRepository.findByUserIdAndOrganizationId(user.getId(), orgId)
                                .map(OrganizationMember::getRole)
                                .orElse("GUEST");
        }

        public List<OrganizationMember> getOrganizationMembers(Long orgId) {
                return organizationMemberRepository.findByOrganizationId(orgId);
        }

        @Transactional
        public void updateMemberRole(Long orgId, Long userId, String newRole) {
                OrganizationMember member = organizationMemberRepository.findByUserIdAndOrganizationId(userId, orgId)
                                .orElseThrow(() -> new RuntimeException("Member not found"));

                member.setRole(newRole.toUpperCase());
                organizationMemberRepository.save(member);
        }
}
