# Shoply Backend — Authentication & Authorization Architecture

**Document ID:** SHOP-AUTH-ARCH-01
**Version:** 1.0
**Date:** 2026-11-05
**Author:** Senior Spring Security Architect
**Status:** Approved for review (no code yet)
**Sources:** SRS.md (§5, §9, §23), BACKEND_ARCHITECTURE.md (§4), BACKEND_DATABASE_DESIGN.md (§4.1, §8.1), PROJECT_PLANNING.md
**Scope:** Design only. No controllers, services, filters, or security configuration code is implemented in this step.

---

## 1. Purpose

This document defines the authentication and authorization architecture for the Shoply backend. It is the single source of truth for how users register, log in, log out, how sessions are carried, how roles are enforced, and how the system defends against the threats listed in SRS §23 (SEC-01 … SEC-20).

It is written for both reviewers and implementers. Each section states the **decision**, the **rationale**, and the **trade-off** so a reviewer can challenge it before any code is written.

---

## 2. Glossary

| Term | Meaning |
|---|---|
| **Session** | A short-lived JWT that proves the caller is authenticated. Carried in an httpOnly cookie. |
| **JWT** | JSON Web Token — a signed, self-contained token. Shoply uses it as a stateless session carrier, not as an authorization grant. |
| **HS256** | HMAC-SHA-256 — symmetric signing algorithm. Both signing and verification use the same secret. |
| **tokenVersion** | An integer column on `users`. Embedded in the JWT. When the server-side value differs from the token's value, the token is rejected. Enables instant logout / password-change revocation without a token store. |
| **BCrypt** | Adaptive password hashing algorithm. Cost factor determines how expensive hashing is. |
| **CSRF** | Cross-Site Request Forgery — tricking a browser into sending an authenticated request. |
| **XSS** | Cross-Site Scripting — injecting script into a page that runs with the user's privileges. |
| **Role** | One of `CUSTOMER`, `STAFF`, `ADMIN`. Stored as a single column on `users`. |
| **Ownership scoping** | A service checks that the resource being accessed belongs to the authenticated user (or that the caller is staff/admin). |
| **Whitelist binding** | Request DTOs contain only fields the client is allowed to set. `role`, `status`, `price`, `stock`, `total` are never accepted from the client. |

---

## 3. High-Level Picture

```
Browser (React)                          Spring Boot Backend                      MySQL
┌──────────────────┐                    ┌──────────────────────────────┐         ┌─────────┐
│  React app       │  HTTPS + cookie     │  SecurityFilterChain         │         │ users   │
│  - reads XSRF    │ ──────────────────► │   - CSRF filter              │ ──────► │   ...   │
│    cookie, sends │  POST /api/v1/auth  │   - JWT auth filter          │         └─────────┘
│    X-XSRF-TOKEN  │  /login             │   - RateLimit filter         │
│    header        │                    │   - AuthController           │
│                  │ ◄────────────────── │     - AuthService            │
│  stores NO       │  Set-Cookie:        │       - BCrypt verify        │
│  tokens in JS    │  shoply_session     │       - JWT issue            │
└──────────────────┘                    └──────────────────────────────┘
```

**Three rules that everything else hangs on:**

1. **The browser never sees the JWT.** It lives only inside an httpOnly cookie. JavaScript cannot read it (XSS cannot steal it).
2. **The database is the source of truth for "is this session still valid?"** via `tokenVersion`. A stolen cookie can be killed by changing one integer.
3. **Roles are never trusted from the client.** They come from the `users` table, loaded fresh on every authenticated request.

---

## 4. Authentication Architecture

### 4.1 Customer Registration

**Endpoint:** `POST /api/v1/auth/register`
**Auth:** Public (no session required)

**Flow:**

1. Client sends `UserRegistrationRequest` (fullName, email, password). Only these three fields are accepted (whitelist binding, SEC-06).
2. Controller validates the DTO with `@Valid` (Jakarta Bean Validation). Failures → 400 with field-level errors via `GlobalExceptionHandler`.
3. `AuthService.register()`:
   a. Normalize email (trim, lowercase). The DB collation `utf8mb4_0900_ai_ci` makes lookups case-insensitive, but we normalize anyway for consistency.
   b. Check `UserRepository.existsByEmail(email)`. If true → throw `DuplicateResourceException` → 409. Message is generic ("An account with this email already exists") — does not leak whether the email exists in other contexts (SEC-07).
   c. Validate password strength (min 8 chars, 1 uppercase, 1 digit) — enforced by `@Pattern` on the DTO AND a service-side check (defense in depth).
   d. Hash password with BCrypt (cost 12). Plain password is never stored, never logged.
   e. Create `User` with `role = CUSTOMER`, `accountStatus = ACTIVE`, `tokenVersion = 0`.
   f. Save user. Catch `DataIntegrityViolationException` (race condition on unique email) → re-throw as `DuplicateResourceException`.
   g. **Do NOT auto-login.** Registration returns the created user's profile (UserResponse) with 201 Created. The client then calls `/login`. (Alternative: auto-login is a UX choice; we keep them separate so the login flow — including rate limiting and session issuance — is the single path. Decision point for review.)
   h. Write an audit log entry: `USER_REGISTERED` (no PII beyond user id).

**Response:** `201 Created` with `UserResponse` (id, email, fullName, role, accountStatus, createdAt). No password hash, no token.

**Error cases:**

| Condition | HTTP | Response |
|---|---|---|
| Validation failure | 400 | fieldErrors |
| Email already exists | 409 | "An account with this email already exists" |
| Password too weak | 400 | fieldErrors |
| Unexpected | 500 | generic |

### 4.2 Customer Login

**Endpoint:** `POST /api/v1/auth/login`
**Auth:** Public

**Flow:**

1. Client sends `UserLoginRequest` (email, password).
2. Controller validates DTO.
3. Rate limiter checks `(email + client IP)` bucket. If exceeded → 429 Too Many Requests. (FR-AUTH-08)
4. `AuthService.login()`:
   a. Normalize email.
   b. Look up user by email. **If not found, do NOT return early.** Continue to a dummy BCrypt verification to keep timing constant (prevents user-enumeration via timing). Then throw `BadCredentialsException`.
   c. Check `accountStatus == ACTIVE`. If `BLOCKED` → throw `AccountBlockedException` (maps to 403 with message "Account is blocked. Contact support."). This is the one place where we distinguish — a blocked account is a deliberate state, not an enumeration vector (the email is already known to the caller since they typed it). Actually, to be safe and consistent with SEC-07, we return the same generic message for blocked accounts too: "Invalid email or password." Decision point for review.
   d. Verify password with `BCryptPasswordEncoder.matches(rawPassword, user.getPasswordHash())`. If false → throw `BadCredentialsException`.
   e. On success: issue JWT (§6), set `shoply_session` cookie, issue CSRF token cookie, reset rate-limit bucket for this email+IP.
   f. Increment `tokenVersion`? **No** — login does not invalidate other sessions. A user can be logged in on multiple devices. (Alternative: single-session-per-user is a product decision; we allow multiple. Decision point.)
   g. Write audit log: `USER_LOGIN` (user id, IP, timestamp — no password).

**Response:** `200 OK` with `UserResponse` (current user profile). Cookie `shoply_session` is set in the response. The body does NOT contain the token.

**Error cases:**

| Condition | HTTP | Response |
|---|---|---|
| Validation failure | 400 | fieldErrors |
| Wrong email/password | 401 | "Invalid email or password" (identical message) |
| Account blocked | 401 or 403 | "Invalid email or password" (same as above, SEC-07) |
| Rate limited | 429 | "Too many attempts. Try again in 15 minutes." |
| Unexpected | 500 | generic |

**Timing attack mitigation:** Even on "user not found", we run `passwordEncoder.matches(rawPassword, DUMMY_HASH)` to keep response time roughly equal. The dummy hash is a valid BCrypt hash of a random string, computed once at startup.

### 4.3 Logout

**Endpoint:** `POST /api/v1/auth/logout`
**Auth:** Authenticated (session cookie required)

**Flow:**

1. CSRF filter validates the double-submit token.
2. `AuthService.logout()`:
   a. Read the JWT from the cookie. If invalid/missing → still return 204 (idempotent logout).
   b. Extract `userId` and `tokenVersion` from the JWT.
   c. Load user from DB. Increment `tokenVersion` (`user.incrementTokenVersion()`). Save.
   d. This immediately invalidates ALL of the user's sessions (every device), because every existing JWT now carries a stale `tokenVersion`.
   e. Write audit log: `USER_LOGOUT`.
3. Controller clears the `shoply_session` cookie (Max-Age=0) and the `XSRF-TOKEN` cookie.
4. Rotate the guest cart token (FR-AUTH-14): issue a fresh `shoply_guest` cookie.

**Response:** `204 No Content`.

**Why increment tokenVersion on logout:** This is server-side session invalidation (FR-AUTH-14, SEC-17). The cookie is not merely discarded client-side; the JWT itself becomes invalid because its embedded `tokenVersion` no longer matches the DB.

### 4.4 Current Authenticated User

**Endpoint:** `GET /api/v1/auth/me` (the user's task says `GET /api/v1/auth/me`; the architecture doc uses `/session`. We standardize on `/me` to match the task spec and the frontend's expected `/auth/me`.)
**Auth:** Authenticated

**Flow:**

1. JWT filter extracts and validates the token from the cookie.
2. `AuthService.me()` loads the user from DB by `userId` from the JWT. Returns `UserResponse`.
3. If the user was blocked after the token was issued → 401 (the JWT filter checks `accountStatus` on every request, or the service does). We check in the filter so blocked users are rejected before hitting the controller.

**Response:** `200 OK` with `UserResponse`.

**Error cases:**

| Condition | HTTP |
|---|---|
| No cookie / invalid token | 401 |
| Token version mismatch | 401 |
| Account blocked | 401 |
| User deleted (shouldn't happen — accounts are never deleted) | 401 |

### 4.5 Token Refresh

**Endpoint:** `POST /api/v1/auth/refresh`
**Auth:** Authenticated (valid session required)

**Strategy: Sliding expiration with refresh endpoint.**

- Access token (the `shoply_session` cookie) has a 15-minute lifetime.
- When the frontend detects the session is about to expire (or on a 401), it calls `/auth/refresh`.
- Refresh issues a new JWT with a fresh 15-minute expiry and a new `tokenVersion` check, **without** requiring the user to re-enter credentials.
- The refresh endpoint is rate-limited (10/min per user) to prevent abuse.
- Refresh does NOT extend the absolute session lifetime. The JWT carries an `iat` (issued-at). If `now - iat > 7 days` (absolute max), refresh is rejected and the user must log in again. This prevents indefinite session extension.

**Trade-off:** We considered (a) long-lived single token (simpler, but a stolen token is valid for days) and (b) separate refresh token in a second cookie (more complex, two tokens to manage). We chose sliding expiration with a single token + refresh endpoint for simplicity at portfolio scale, while keeping the absolute cap. Decision point for review.

### 4.6 Password Change

**Endpoint:** `POST /api/v1/me/password` (part of user profile, not auth)
**Auth:** Authenticated

**Flow:**

1. Client sends `ChangePasswordRequest` (currentPassword, newPassword).
2. Verify current password with BCrypt.
3. Validate new password strength.
4. Hash new password, save.
5. Increment `tokenVersion` → invalidates all other sessions (SEC-17). The current session's token is also invalidated, so the client must re-login. (Alternative: keep current session valid. We invalidate all for security. Decision point.)

### 4.7 Password Reset (Forgot Password)

**Status:** Deferred to V1.5 (FR-AUTH-06). Not in V1 scope.

**Design sketch (for future):** `POST /api/v1/auth/forgot-password` sends a time-limited, single-use token via email. `POST /api/v1/auth/reset-password` validates the token and sets a new password, incrementing `tokenVersion`. Requires an email provider (out of scope for V1).

---

## 5. Password Security

### 5.1 Hashing

- **Algorithm:** BCrypt, cost factor 12.
- **Why BCrypt:** Adaptive (cost can increase over time), built-in salt, widely supported by Spring Security's `BCryptPasswordEncoder`. Argon2 is arguably stronger but BCrypt is sufficient and simpler for V1.
- **Storage:** `users.password_hash` VARCHAR(255). BCrypt output is 60 chars; 255 gives headroom.
- **Never** store plaintext. Never store reversible encryption. Never log.

### 5.2 Verification

`BCryptPasswordEncoder.matches(rawPassword, storedHash)` — constant-time comparison internally. We do not implement our own comparison.

### 5.3 Password Rules

Mirrors frontend (FR-AUTH-01, SRS §10.2):
- Min 8 characters
- At least 1 uppercase letter
- At least 1 digit
- Max 128 characters (prevents BCrypt DoS via extremely long passwords — BCrypt truncates at 72 bytes, but we reject longer inputs)

Enforced by `@Pattern` on DTO + service-side check.

### 5.4 Never Log Passwords

- `GlobalExceptionHandler` logs only error messages and request paths. Never request bodies.
- Audit logs record event type + user id + IP + timestamp. Never credentials.
- Spring Security's default logging is at INFO; we set `org.springframework.security` to WARN in prod to avoid verbose auth logs.

---

## 6. JWT Strategy

### 6.1 Token Structure

**Algorithm:** HS256 (HMAC-SHA-256).
**Signing secret:** `JWT_SECRET` environment variable, minimum 32 bytes (256 bits). Generated per environment. Never committed.

**Claims (payload):**

| Claim | Value | Notes |
|---|---|---|
| `sub` | user id (Long as string) | Subject — who this token is for |
| `email` | user email | Convenience for logging; not sensitive |
| `role` | `CUSTOMER` / `STAFF` / `ADMIN` | Role at issuance time |
| `tv` | tokenVersion (int) | For revocation check |
| `iat` | issued-at (epoch seconds) | For absolute session cap |
| `exp` | expiry (epoch seconds) | 15 minutes from `iat` |

**What is NOT in the JWT:**
- Password hash (obviously)
- Full name, address, phone (PII minimization)
- Permissions list (role is sufficient; permissions are derived server-side)
- Any secret or internal ID beyond user id

### 6.2 Token Generation

On successful login (and refresh):
1. Load user from DB.
2. Build JWT with claims above.
3. Sign with `JWT_SECRET` using HS256.
4. Set as `shoply_session` cookie.

### 6.3 Token Validation (JWT Filter)

On every authenticated request, the `JwtAuthenticationFilter` (a `OncePerRequestFilter`):

1. Extract `shoply_session` cookie. If missing → continue as anonymous (Spring Security will reject if endpoint requires auth).
2. Parse and verify JWT signature with `JWT_SECRET`. If invalid → 401.
3. Check `exp`. If expired → 401.
4. Extract `userId`, `tokenVersion`, `role`, `iat`.
5. Check absolute session cap: if `now - iat > 7 days` → 401 (must re-login).
6. Load user from DB by `userId`. If not found → 401.
7. Compare `tokenVersion` in JWT with `user.tokenVersion`. If mismatch → 401 (session revoked).
8. Check `accountStatus == ACTIVE`. If `BLOCKED` → 401.
9. Build `Authentication` (principal = user id, authorities = role), set in `SecurityContextHolder`.
10. Continue filter chain.

**Why load user from DB on every request:** Role changes and blocks take effect immediately (FR-AUTH-12, FR-AUTH-10). The JWT's role claim is a hint; the DB is authoritative. Trade-off: one DB query per authenticated request. Acceptable at portfolio scale; can be cached with short TTL later.

### 6.4 Token Revocation / Logout Strategy

**Mechanism:** `tokenVersion` column on `users`.

- JWT embeds `tv` = tokenVersion at issuance.
- On logout: `user.incrementTokenVersion()` → DB value becomes N+1. Every existing JWT now has stale `tv` → rejected by the filter.
- On password change: same increment → all sessions invalidated (SEC-17).
- On admin block: same increment → all sessions invalidated.
- No token store, no Redis, no denylist. One integer per user. O(1) revocation.

**Trade-off:** This invalidates ALL sessions on logout (not just the current device). Acceptable for V1. Per-device revocation would require a token store (deferred).

### 6.5 Refresh Token Security

No separate refresh token. The single `shoply_session` JWT is refreshed via `/auth/refresh` (§4.5) with:
- Rate limit: 10/min per user.
- Absolute cap: 7 days from original `iat`.
- `tokenVersion` check still applies.

### 6.6 Signing Secret Management

- `JWT_SECRET` env var, min 32 bytes.
- Dev: default provided (`shoply_dev_jwt_secret_min_32_bytes_long!!`) — clearly marked as dev-only.
- Prod: MUST be set; app refuses to start if missing or < 32 bytes (fail-fast `@PostConstruct` validation in `JwtUtil`).
- Rotation: changing the secret invalidates all sessions (everyone must re-login). Documented as a maintenance procedure.

---

## 7. Browser Authentication — Cookie Strategy

### 7.1 Comparison

| Approach | XSS risk | CSRF risk | Auto-send | Verdict |
|---|---|---|---|---|
| **localStorage** | Token readable by JS → stolen via XSS | Not auto-sent → no CSRF | Manual header | ❌ Rejected (SEC-03) |
| **sessionStorage** | Same as localStorage | Same | Manual header | ❌ Rejected |
| **httpOnly cookie** | JS cannot read → XSS cannot steal | Auto-sent → CSRF risk | Automatic | ✅ Chosen (with CSRF mitigation) |

### 7.2 Decision: httpOnly Cookie + CSRF Double-Submit

**Cookie: `shoply_session`**
- `HttpOnly` — JS cannot read (XSS mitigation)
- `Secure` — only sent over HTTPS (prod; false in dev)
- `SameSite=Lax` — sent on top-level navigations and same-site requests; not sent on cross-site POST (CSRF mitigation for most cases)
- `Path=/` — sent to all paths
- `Max-Age=900` (15 min) — matches JWT expiry
- `Domain` — not set (defaults to exact host, prevents subdomain leakage)

**CSRF mitigation (defense in depth, because SameSite=Lax alone is not enough for all browsers/versions):**

Double-submit cookie pattern:
- Server sets `XSRF-TOKEN` cookie (NOT httpOnly — JS must read it) with a random value.
- Client reads `XSRF-TOKEN` from `document.cookie` and sends it as `X-XSRF-TOKEN` header on every state-changing request (POST/PUT/PATCH/DELETE).
- Server's CSRF filter compares cookie value vs header value. Mismatch → 403.
- The `shoply_session` cookie is the auth credential; the `XSRF-TOKEN` cookie is the CSRF proof. An attacker on another origin cannot read the `XSRF-TOKEN` cookie (same-origin policy), so they cannot forge the header.

**CORS:**
- Allowed origins: explicit allowlist (`http://localhost:5173` in dev, production frontend origin in prod).
- `allowCredentials=true` — required for cookies.
- No wildcard origins when credentials are enabled.

### 7.3 Guest Identity Cookie

**Cookie: `shoply_guest`**
- Opaque random token (UUID), NOT an auth credential.
- `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`.
- Binds the guest cart. Rotated on login (cart merge) and on logout.
- Grants access ONLY to that guest's cart. No user data.

---

## 8. Authorization

### 8.1 Roles

| Role | Scope |
|---|---|
| `CUSTOMER` | Storefront + own account (`/me/**`, `/orders/**` own only) |
| `STAFF` | Product, inventory, order management (admin area) |
| `ADMIN` | Everything STAFF + customer management, categories, settings, refunds |

Roles are stored as a single VARCHAR column on `users` (no separate roles table — DEC-02 from database design). Three fixed roles; no dynamic permissions.

### 8.2 Role Assignment

- **Registration:** always `CUSTOMER`. Client cannot set role (whitelist binding).
- **Seeded admin:** created by `SeedRunner` on first startup if no admin exists. Credentials from env vars (`SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`).
- **Role change:** admin-only endpoint `PATCH /api/v1/admin/users/{id}/role`. Requires last-admin guard rail (FR-AUTH-11): cannot demote/block/delete the last active admin.
- **Role changes take effect on next request** (FR-AUTH-12) — the JWT filter loads the role from DB, not from the JWT claim.

### 8.3 Protected Endpoint Rules

**URL-level (SecurityConfig matchers):**

| Pattern | Access |
|---|---|
| `/api/v1/auth/register`, `/api/v1/auth/login` | Public |
| `/api/v1/auth/logout`, `/api/v1/auth/me`, `/api/v1/auth/refresh` | Authenticated |
| `/api/v1/admin/**` | STAFF or ADMIN |
| `/api/v1/me/**`, `/api/v1/orders/**`, `/api/v1/cart/**`, `/api/v1/checkout/**` | Authenticated (CUSTOMER+) |
| `/api/v1/webhooks/stripe` | Signature-verified (no cookie/CSRF) |
| `/api/v1/health` | Public |
| Everything else | Authenticated |

**Method-level (`@PreAuthorize`):**

Fine-grained control on individual controller methods. Examples:
- `@PreAuthorize("hasRole('ADMIN')")` on category delete.
- `@PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")` on product publish.
- `@PreAuthorize("@ownershipChecker.isOwner(authentication, #orderId)")` for order detail.

**Ownership scoping (FR-AUTH-07a):**

Services enforce that users can only access their own resources. A valid session accessing another user's resource returns `404 NOT_FOUND` (not `403`) to avoid resource-existence disclosure.

Implementation: service methods take the authenticated user's id and filter queries by it. Example: `OrderService.findByIdAndUserId(orderId, userId)`.

### 8.4 Blocked Account Enforcement (FR-AUTH-10)

- Blocked accounts cannot authenticate (login rejected).
- Blocked accounts cannot use existing sessions for mutating operations. The JWT filter checks `accountStatus` on every request; if `BLOCKED`, returns 401.
- Read-only access to historical orders remains (so a blocked user can still see their past orders). Implemented via endpoint-level checks: GET order history allowed for blocked users, POST/PUT/PATCH/DELETE rejected.
- Existing historical orders are never modified.

### 8.5 Admin Login Surface Separation (FR-AUTH-13, SEC-20)

- Admin users authenticate through the same `/api/v1/auth/login` endpoint (same credential store).
- The frontend has a separate admin login page (`/admin/login`) that calls the same endpoint.
- `CUSTOMER`-only accounts attempting admin routes receive 403.
- Failed admin logins are logged (audit trail).
- No separate auth system — just role-based routing on the frontend and role-based enforcement on the backend.

---

## 9. Security Architecture (Implementation Plan)

This section describes the components that will be implemented in Step 32+ (not now).

### 9.1 Component Map

| Component | Package | Responsibility |
|---|---|---|
| `SecurityConfig` | `platform/config/` | Filter chain, URL matchers, CSRF config, CORS, headers, password encoder bean |
| `JwtUtil` | `platform/security/` | Generate, parse, validate JWT; secret validation |
| `JwtAuthenticationFilter` | `platform/filter/` | Extract cookie → validate → set SecurityContext |
| `CsrfTokenFilter` | `platform/filter/` | Double-submit CSRF validation |
| `RateLimitFilter` | `platform/filter/` | Sliding window per email+IP on auth endpoints |
| `UserDetailsService` | `identity/service/` | Load user by email for Spring Security |
| `AuthService` | `identity/service/` | Register, login, logout, refresh, me |
| `UserService` | `identity/service/` | Profile, password change |
| `PasswordEncoder` | bean in SecurityConfig | BCryptPasswordEncoder (cost 12) |

### 9.2 Spring Security Filter Chain Order

```
1. RateLimitFilter          (auth endpoints only)
2. RequestIdFilter          (MDC + response header)
3. CorsFilter              (Spring's, configured)
4. CsrfTokenFilter         (validates X-XSRF-TOKEN on state-changing requests)
5. JwtAuthenticationFilter (extracts + validates session cookie)
6. ExceptionTranslationFilter (converts auth exceptions to 401/403)
7. AuthorizationFilter     (URL matchers + @PreAuthorize)
```

### 9.3 UserDetailsService

`ShoplyUserDetailsService implements UserDetailsService`:
- `loadUserByUsername(email)` → loads User from DB.
- Returns `UserDetails` with username = email, password = passwordHash, authorities = role.
- Throws `UsernameNotFoundException` if not found (caught and converted to generic 401 by the auth flow, not by this method — we override to avoid leaking existence).

Actually, to prevent user enumeration, the login flow does NOT use `UserDetailsService` directly for the "user not found" case. Instead, `AuthService.login()` does the lookup itself and runs a dummy BCrypt comparison. `UserDetailsService` is used only by Spring Security's internal machinery (e.g., if we add form-login later, which we won't). It exists for completeness and for `@PreAuthorize`'s `authentication.principal`.

### 9.4 Password Encoder

`BCryptPasswordEncoder(12)` — registered as a `@Bean` in `SecurityConfig`. Injected into `AuthService` and `UserService`.

### 9.5 Authentication DTOs

Already created in Step 28:
- `UserRegistrationRequest` (fullName, email, password) — needs `@Pattern` for password strength added.
- `UserLoginRequest` (email, password)
- `UserResponse` (id, email, fullName, role, accountStatus, createdAt)

New DTOs needed (not yet created):
- `ChangePasswordRequest` (currentPassword, newPassword)
- `AuthResponse` (optional — login response could just be UserResponse + cookie; we use UserResponse + cookie, no separate wrapper)

### 9.6 Authorization Rules (Spring Security Config)

```java
http
  .csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
    .csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler()))
  .cors(cors -> cors.configurationSource(corsConfigurationSource()))
  .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
  .authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/v1/auth/register", "/api/v1/auth/login").permitAll()
    .requestMatchers("/api/v1/health").permitAll()
    .requestMatchers("/api/v1/webhooks/stripe").permitAll() // signature-verified in controller
    .requestMatchers("/api/v1/admin/**").hasAnyRole("STAFF", "ADMIN")
    .anyRequest().authenticated()
  )
  .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
  .headers(headers -> headers
    .frameOptions(HeadersConfigurer.FrameOptionsConfig::deny)
    .contentTypeOptions(Customizer.withDefaults())
    .httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31536000))
  );
```

### 9.7 Security Headers

Set by Spring Security + a custom filter for CSP:
- `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` (prod only)
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 10. API Design (Auth Endpoints)

### 10.1 POST /api/v1/auth/register

**Request:**
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "Secret123"
}
```

**Response 201:**
```json
{
  "id": 1,
  "email": "jane@example.com",
  "fullName": "Jane Doe",
  "role": "CUSTOMER",
  "accountStatus": "ACTIVE",
  "createdAt": "2026-11-05T12:00:00Z"
}
```
No cookie set. Client calls `/login` next.

### 10.2 POST /api/v1/auth/login

**Request:**
```json
{
  "email": "jane@example.com",
  "password": "Secret123"
}
```

**Response 200:** `UserResponse` (same shape as above) + `Set-Cookie: shoply_session=...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=900` + `Set-Cookie: XSRF-TOKEN=...; Path=/; Max-Age=900`.

### 10.3 POST /api/v1/auth/logout

**Request:** (no body; cookie + X-XSRF-TOKEN header required)

**Response 204:** `Set-Cookie: shoply_session=; Max-Age=0` + `Set-Cookie: XSRF-TOKEN=; Max-Age=0` + `Set-Cookie: shoply_guest=<new>; ...`

### 10.4 POST /api/v1/auth/refresh

**Request:** (no body; valid session cookie required)

**Response 200:** `UserResponse` + refreshed `shoply_session` cookie (new 15-min expiry).

### 10.5 GET /api/v1/auth/me

**Request:** (session cookie required)

**Response 200:** `UserResponse`.

---

## 11. Security Risks & Mitigations

| Risk | Mitigation |
|---|---|
| **XSS stealing session** | httpOnly cookie — JS cannot read. CSP restricts script sources. |
| **CSRF** | SameSite=Lax + double-submit XSRF-TOKEN cookie/header. |
| **Session fixation** | JWT is stateless; no server-side session to fixate. New token on login. |
| **Brute force** | Rate limiter: 5 attempts / 15 min per email+IP. Generic error messages. |
| **User enumeration** | Identical error for unknown email vs wrong password. Dummy BCrypt on not-found. Timing equalization. |
| **Token theft** | Short 15-min lifetime. tokenVersion revocation. Absolute 7-day cap. |
| **Token replay after logout** | tokenVersion increment invalidates all tokens. |
| **Password in logs** | Never logged. Audit logs exclude credentials. |
| **Mass assignment** | Whitelist binding — DTOs contain only client-settable fields. |
| **SQL injection** | JPA parameterized queries only. No string-built SQL. |
| **Secret leakage** | Env vars only. `.env` gitignored. Fail-fast if JWT_SECRET < 32 bytes in prod. |
| **Blocked account access** | accountStatus checked on every request in JWT filter. |
| **Last admin lockout** | Guard rail: cannot demote/block/delete last active admin. |
| **Role escalation** | Role from DB on every request, not from JWT claim. Client cannot set role. |
| **CORS misconfiguration** | Explicit allowlist. No wildcards with credentials. |

---

## 12. Decisions Requiring Review

Before implementing, the reviewer should confirm or challenge these:

| # | Decision | Current Choice | Alternative | Impact |
|---|---|---|---|---|
| D-1 | Auto-login after registration | No (separate /login call) | Yes (issue cookie on register) | UX vs single auth path |
| D-2 | Blocked account error message | Generic "Invalid email or password" (SEC-07) | Distinct "Account blocked" | Enumeration vs UX |
| D-3 | Multi-device sessions | Allowed (login doesn't invalidate others) | Single session per user | Convenience vs security |
| D-4 | Password change invalidates current session | Yes (all sessions) | Keep current session | Security vs UX |
| D-5 | Refresh strategy | Sliding 15-min + /refresh endpoint, 7-day absolute cap | Long-lived single token | Complexity vs simplicity |
| D-6 | Logout scope | All devices (tokenVersion increment) | Current device only | Security vs convenience |
| D-7 | JWT in cookie vs Authorization header | Cookie (httpOnly) | Bearer header | XSS vs CSRF trade-off |
| D-8 | Password hashing | BCrypt cost 12 | Argon2 | Simplicity vs strength |
| D-9 | Guest cart token | Separate `shoply_guest` cookie | Reuse session cookie | Clarity vs simplicity |
| D-10 | Email normalization | Lowercase + trim in service | DB collation only | Consistency |

---

## 13. What This Document Does NOT Cover

- Service/controller/repository implementation (Step 32+).
- Email provider integration (password reset deferred to V1.5).
- OAuth/social login (not in scope).
- Multi-factor authentication (not in scope).
- Per-device session management (deferred — requires token store).
- Rate limiter implementation details (in-memory sliding window, separate doc).

---

## 14. Next Steps

1. **Review & approve** this architecture (especially the 10 decisions in §12).
2. **Step 32:** Implement `platform` security infrastructure — `SecurityConfig`, `JwtUtil`, `JwtAuthenticationFilter`, `CsrfTokenFilter`, `RateLimitFilter`, CORS, headers.
3. **Step 33:** Implement `identity` module — `UserDetailsService`, `AuthService`, `UserService`, `AuthController`, `UserController`.
4. **Step 34:** Integration tests for auth flows (register, login, logout, me, refresh, blocked, rate limit).

---

*End of document.*