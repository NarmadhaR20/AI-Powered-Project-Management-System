package com.example.projectmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.projectmanagement.entity.ProjectUser;


public interface ProjectUserRepository
  extends JpaRepository<ProjectUser, Long> {
     List<ProjectUser> findByUserId(Long userId);
  }