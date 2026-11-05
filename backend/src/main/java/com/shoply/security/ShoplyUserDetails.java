package com.shoply.security;

import com.shoply.entity.AccountStatus;
import com.shoply.entity.Role;
import com.shoply.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * ShoplyUserDetails — Spring Security representation of a Shoply user.
 *
 * Wraps the persisted User entity and exposes only what Spring Security needs:
 * - email as the username (login identifier)
 * - BCrypt password hash (never exposed via API)
 * - role mapped to a granted authority ({@code ROLE_CUSTOMER}, {@code ROLE_STAFF}, {@code ROLE_ADMIN})
 * - account status mapped to account-lock state
 *
 * The internal user id is kept available for ownership checks and JWT claims.
 */
public class ShoplyUserDetails implements UserDetails {

    private final Long id;
    private final String email;
    private final String passwordHash;
    private final String fullName;
    private final Role role;
    private final AccountStatus accountStatus;
    private final int tokenVersion;

    public ShoplyUserDetails(Long id,
                             String email,
                             String passwordHash,
                             String fullName,
                             Role role,
                             AccountStatus accountStatus,
                             int tokenVersion) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.role = role;
        this.accountStatus = accountStatus;
        this.tokenVersion = tokenVersion;
    }

    /**
     * Build the security representation from a persisted User.
     */
    public static ShoplyUserDetails from(User user) {
        return new ShoplyUserDetails(
            user.getId(),
            user.getEmail(),
            user.getPasswordHash(),
            user.getFullName(),
            user.getRole(),
            user.getAccountStatus(),
            user.getTokenVersion()
        );
    }

    // --- Domain accessors (used by services / future JWT code) ---

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public Role getRole() {
        return role;
    }

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }

    public int getTokenVersion() {
        return tokenVersion;
    }

    // --- UserDetails contract ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // BLOCKED accounts cannot authenticate or use existing sessions.
        return accountStatus == AccountStatus.ACTIVE;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return accountStatus == AccountStatus.ACTIVE;
    }
}
