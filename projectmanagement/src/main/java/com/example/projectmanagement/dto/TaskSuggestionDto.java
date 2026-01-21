package com.example.projectmanagement.dto;

import java.time.LocalDate;

public class TaskSuggestionDto {
    private String title;
    private String priority;
    private String assigneeName;
    private LocalDate dueDate;

    public TaskSuggestionDto(String title, String priority, String assigneeName, LocalDate dueDate) {
        this.title = title;
        this.priority = priority;
        this.assigneeName = assigneeName;
        this.dueDate = dueDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getAssigneeName() {
        return assigneeName;
    }

    public void setAssigneeName(String assigneeName) {
        this.assigneeName = assigneeName;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
}
