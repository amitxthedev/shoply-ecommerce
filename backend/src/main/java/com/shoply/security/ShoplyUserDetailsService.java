package com.shoply.security;

import com.shoply.entity.User;
import com.shoply.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * ShoplyUserDetailsService — loads Shoply users for Spring Security.
 *
 * Email is the login identifier. The service never touches controllers; it is
 * injected into the authentication provider / JWT filter as needed.
 *
 * A missing user throws {@link UsernameNotFoundException}. Callers that expose
 * an authentication result to clients must convert this into a generic
 * "invalid credentials" response (SEC-07) — that conversion happens in the
 * login flow, not here.
 */
@Service
public class ShoplyUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public ShoplyUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return ShoplyUserDetails.from(user);
    }
}
