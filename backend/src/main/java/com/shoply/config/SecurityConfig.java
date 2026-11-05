package com.shoply.config;

import com.shoply.security.RestAccessDeniedHandler;
import com.shoply.security.RestAuthenticationEntryPoint;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestHandler;
import org.springframework.security.web.csrf.XorCsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * SecurityConfig — foundational Spring Security configuration.
 *
 * This step wires password authentication only. JWT issuance, the JWT
 * authentication filter, and the auth endpoints are deliberately NOT added yet;
 * the chain is structured so those pieces slot in without restructuring.
 *
 * Key choices:
 * - Stateless sessions: no server-side HttpSession. The future JWT carries auth.
 * - Form login and HTTP Basic are disabled (API-only backend).
 * - CSRF stays ENABLED. Cookie-based authentication is vulnerable to CSRF, so
 *   we use Spring Security's double-submit cookie repository. The browser reads
 *   the non-httpOnly XSRF-TOKEN cookie and sends it back as X-XSRF-TOKEN on
 *   state-changing requests. Only the Stripe webhook is exempt (verified by
 *   signature instead).
 * - Role rules are declared here (URL-level) with @EnableMethodSecurity for
 *   fine-grained @PreAuthorize rules later.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final RestAuthenticationEntryPoint authenticationEntryPoint;
    private final RestAccessDeniedHandler accessDeniedHandler;

    /**
     * Comma-separated allowlist, supplied by profile config. Never a wildcard,
     * because credentials (cookies) are allowed.
     */
    @Value("${shoply.cors.allowed-origins:http://localhost:5173,http://127.0.0.1:5173}")
    private String allowedOrigins;

    public SecurityConfig(RestAuthenticationEntryPoint authenticationEntryPoint,
                          RestAccessDeniedHandler accessDeniedHandler) {
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.accessDeniedHandler = accessDeniedHandler;
    }

    // --- Password hashing ---

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt cost 12 (SEC-01 / architecture §5). Spring Security handles salt.
        return new BCryptPasswordEncoder(12);
    }

    // --- Authentication plumbing ---

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        // Spring Boot auto-configures a DaoAuthenticationProvider from the
        // UserDetailsService + PasswordEncoder beans above.
        return configuration.getAuthenticationManager();
    }

    // --- Filter chain ---

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // SPA-friendly double-submit CSRF:
        // - the raw token is written to the readable XSRF-TOKEN cookie
        // - the SPA echoes it in the X-XSRF-TOKEN header
        // - setting the request attribute name to null disables BREACH XOR
        //   masking of the attribute used for header comparison
        CookieCsrfTokenRepository tokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        XorCsrfTokenRequestAttributeHandler delegate = new XorCsrfTokenRequestAttributeHandler();
        delegate.setCsrfRequestAttributeName(null);
        CsrfTokenRequestHandler requestHandler = delegate::handle;

        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(tokenRepository)
                .csrfTokenRequestHandler(requestHandler)
                // Stripe webhooks authenticate via signature, not a browser
                // session, so CSRF does not apply to them.
                .ignoringRequestMatchers("/api/v1/webhooks/**")
            )
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(authenticationEntryPoint)
                .accessDeniedHandler(accessDeniedHandler)
            )
            .authorizeHttpRequests(auth -> auth
                // CORS preflight must never require auth.
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Public operational endpoints.
                .requestMatchers("/api/v1/health", "/actuator/health", "/error").permitAll()
                // Public auth endpoints (implemented in a later step).
                .requestMatchers("/api/v1/auth/register", "/api/v1/auth/login").permitAll()
                // Payment webhooks are signature-verified in the controller.
                .requestMatchers("/api/v1/webhooks/**").permitAll()
                // Back office requires STAFF or ADMIN.
                .requestMatchers("/api/v1/admin/**").hasAnyRole("STAFF", "ADMIN")
                // Everything else requires an authenticated user.
                .anyRequest().authenticated()
            );

        return http.build();
    }

    // --- CORS ---

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.stream(allowedOrigins.split(","))
            .map(String::trim)
            .filter(origin -> !origin.isEmpty())
            .toList());
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        // Required so the browser sends/receives the session and CSRF cookies.
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
