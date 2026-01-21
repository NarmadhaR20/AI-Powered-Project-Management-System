package com.example.projectmanagement.repository;

import com.example.projectmanagement.entity.OrganizationMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface OrganizationMemberRepository extends JpaRepository<OrganizationMember, Long> {
    List<OrganizationMember> findByUserId(Long userId);

    List<OrganizationMember> findByOrganizationId(Long organizationId);

    Optional<OrganizationMember> findByUserIdAndOrganizationId(Long userId, Long organizationId);
}
