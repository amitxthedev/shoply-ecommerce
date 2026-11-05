package com.shoply.repository;

import com.shoply.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository — data access for User entity (identity module).
 *
 * Spring Data JPA generates the implementation at runtime.
 * Method names follow Spring Data JPA naming conventions.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by their email address (case-insensitive via utf8mb4_0900_ai_ci).
     * Used for login and registration checks.
     */
    Optional<User> findByEmail(String email);

    /**
     * Check whether a user with the given email already exists.
     * Used during registration to prevent duplicates.
     */
    boolean existsByEmail(String email);

    /**
     * Find all users by role (for admin customer management).
     */
    java.util.List<User> findByRole(com.shoply.entity.Role role);

    /**
     * Find all users by account status (for admin filtering).
     */
    java.util.List<User> findByAccountStatus(com.shoply.entity.AccountStatus accountStatus);
}
