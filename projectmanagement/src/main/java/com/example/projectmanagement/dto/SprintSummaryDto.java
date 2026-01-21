package com.example.projectmanagement.dto;

import java.util.List;

public class SprintSummaryDto {
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private List<String> risks;
    private String moraleStatus;
    private String aiAnalysis;

    public SprintSummaryDto(long totalTasks, long completedTasks, long pendingTasks, List<String> risks,
            String moraleStatus, String aiAnalysis) {
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.pendingTasks = pendingTasks;
        this.risks = risks;
        this.moraleStatus = moraleStatus;
        this.aiAnalysis = aiAnalysis;
    }

    // Getters and Setters
    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public List<String> getRisks() {
        return risks;
    }

    public void setRisks(List<String> risks) {
        this.risks = risks;
    }

    public String getMoraleStatus() {
        return moraleStatus;
    }

    public void setMoraleStatus(String moraleStatus) {
        this.moraleStatus = moraleStatus;
    }

    public String getAiAnalysis() {
        return aiAnalysis;
    }

    public void setAiAnalysis(String aiAnalysis) {
        this.aiAnalysis = aiAnalysis;
    }
}
