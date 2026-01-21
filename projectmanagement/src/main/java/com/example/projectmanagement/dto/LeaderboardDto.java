package com.example.projectmanagement.dto;

public class LeaderboardDto {
    private String userName;
    private String userEmail;
    private long completedTasks;
    private long score;

    public LeaderboardDto(String userName, String userEmail, long completedTasks, long score) {
        this.userName = userName;
        this.userEmail = userEmail;
        this.completedTasks = completedTasks;
        this.score = score;
    }

    // Getters
    public String getUserName() {
        return userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public long getScore() {
        return score;
    }

    // Setters
    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public void setScore(long score) {
        this.score = score;
    }
}
