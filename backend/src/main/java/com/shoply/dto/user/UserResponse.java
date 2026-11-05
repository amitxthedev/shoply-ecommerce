package com.shoply.dto.user;

import java.time.LocalDateTime;

/**
 * UserResponse — DTO for user profile response.
 * Never includes passwordHash or sensitive fields (SEC-06).
 */
public class UserResponse {

    private Long id;
    private String email;
    private String fullName;
    private String role;
    private String accountStatus;
    private LocalDateTime createdAt;

    // --- Constructors ---

    public UserResponse() {
    }

    public UserResponse(Long id, String email, String fullName, String role, String accountStatus, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.accountStatus = accountStatus;
        this.createdAt = createdAt;
    }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
