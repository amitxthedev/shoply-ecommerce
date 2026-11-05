package com.shoply.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/**
 * Address entity — saved address book (FR-CUS-05).
 *
 * Per DATABASE_DESIGN.md §4.1:
 * - Many addresses per user.
 * - Exactly one default per user (BR-15, enforced by partial unique index).
 * - Hard-deletable because orders snapshot addresses (BR-16).
 * - No FK from orders to addresses (by design).
 */
@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Size(max = 60)
    @Column(name = "label", length = 60)
    private String label;

    @NotBlank
    @Size(max = 100)
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @NotBlank
    @Size(max = 120)
    @Column(name = "address_line_1", nullable = false, length = 120)
    private String addressLine1;

    @Size(max = 120)
    @Column(name = "address_line_2", length = 120)
    private String addressLine2;

    @NotBlank
    @Size(max = 60)
    @Column(name = "city", nullable = false, length = 60)
    private String city;

    @NotBlank
    @Size(max = 60)
    @Column(name = "state", nullable = false, length = 60)
    private String state;

    @NotBlank
    @Size(max = 20)
    @Column(name = "zip", nullable = false, length = 20)
    private String zip;

    @NotBlank
    @Size(max = 60)
    @Column(name = "country", nullable = false, length = 60)
    private String country;

    @Column(name = "is_default", nullable = false)
    private boolean isDefault = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // --- Constructors ---

    protected Address() {
        // JPA requires no-arg constructor
    }

    public Address(User user, String fullName, String addressLine1, String city, String state, String zip, String country) {
        this.user = user;
        this.fullName = fullName;
        this.addressLine1 = addressLine1;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.country = country;
        this.isDefault = false;
    }

    // --- Lifecycle callbacks ---

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAddressLine1() {
        return addressLine1;
    }

    public void setAddressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
    }

    public String getAddressLine2() {
        return addressLine2;
    }

    public void setAddressLine2(String addressLine2) {
        this.addressLine2 = addressLine2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean isDefault) {
        this.isDefault = isDefault;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
