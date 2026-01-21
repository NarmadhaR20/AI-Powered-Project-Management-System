package com.example.projectmanagement.repository;

import com.example.projectmanagement.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
}
