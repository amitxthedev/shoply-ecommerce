# Shoply — Backend Architecture Plan

| Field | Value |
|---|---|
| **Project name** | Shoply |
| **Document type** | Backend Architecture Planning Specification |
| **Version** | 1.0 |
| **Date** | 2026-11-05 |
| **Status** | 🟡 Draft — Awaiting approval before implementation |
| **Author** | Senior Backend Architect |
| **Sources of truth** | `docs/SYSTEM_ARCHITECTURE.md` · `docs/DATABASE_DESIGN.md` · `docs/API_DOCUMENTATION.md` · `docs/SRS.md` · `docs/PROJECT_PLANNING.md` |
| **Stack** | Java 21 · Spring Boot 3.x · Spring Security · Spring Data JPA · Hibernate · MySQL 8 · Maven |
| **Architecture style** | Modular monolith — package-by-feature with layered internals |
| **Code status** | ❌ No backend code yet — this document plans the architecture |

---

## Table of Contents

1. [Backend Modules](#1-backend-modules)
2. [Backend Architecture Layers](#2-backend-architecture-layers)
3. [REST API Structure](#3-rest-api-structure)
4. [Security Strategy](#4-security-strategy)
5. [Backend Folder Structure](#5-backend-folder-structure)
6. [Database Integration](#6-database-integration)
7. [Development Sequence](#7-development-sequence)
8. [Summary & Approval](#8-summary--approval)

---

## 1. Backend Modules

Shoply's backend is a **modular monolith** — one Spring Boot application divided into feature packages. Each module owns its data, business rules, and API endpoints. Modules communicate through service interfaces only, never through direct repository or entity access.

### 1.1 Module Inventory

| # | Module | Package | Owns | Key Responsibilities |
|---|---|---|---|---|
| 1 | **platform** | `com.shoply.platform` | Config, security filter chain, error advice, request-ID filter, rate-limit filter, `FileStorage` port, health endpoint, Flyway, seed runner | Infrastructure depended on by all modules. Depends on nothing. |
| 2 | **identity** | `com.shoply.identity` | Users, credentials, roles, session/token version, addresses, profile, admin customer management | Registration, login, logout, JWT session, password management, address book, role-based access |
| 3 | **catalog** | `com.shoply.catalog` | Categories, products, variants, product images, publish/archive state, listing & search queries | Product CRUD, category tree, variant management (size×color), image upload, search/filter/sort |
| 4 | **cart** | `com.shoply.cart` | Server-side carts, lines, guest-session binding, merge-on-login, cart totals | Add/update/remove cart lines, guest cart binding, merge guest cart on login, cart totals |
| 5 | **checkout** | `com.shoply.checkout` | Orders, order items, state machine (T1–T9), status history, payments (gateway port, Stripe/mock adapters, webhook processing, refunds), expiry job, storefront + admin order endpoints | Order placement, payment intent creation, webhook processing, order state transitions, order expiry job, refunds |
| 6 | **inventory** | `com.shoply.inventory` | Stock levels per variant, conditional stock mutations, stock ledger, manual adjustments, low-stock queries | Stock reserve/release, conditional decrement, stock movement ledger, low-stock alerts |
| 7 | **reporting** | `com.shoply.reporting` | Dashboard KPIs, top products, recent orders, low-stock count | Read-only aggregation queries for admin dashboard |

### 1.2 Module Dependency Rules (Acyclic)

```
platform ← identity, catalog, cart, checkout, inventory, reporting
catalog ← cart, checkout, reporting
identity ← cart, checkout, reporting
inventory ← checkout, reporting
cart ← checkout, reporting
reporting → (read-only leaf, nothing depends on it)
```

**Rules:**
1. `platform` depends on nothing.
2. `reporting` is a leaf — nothing depends on it.
3. No cycles allowed; enforced by ArchUnit tests in CI.
4. Cross-module calls go through **service interfaces**, never repositories or entities.
5. Writes are single-module: only `inventory` mutates stock; only `checkout` mutates orders/payments; only `identity` mutates users.

### 1.3 Module → Frontend Feature Mapping

| Backend Module | Frontend Feature Folder |
|---|---|
| identity | `/features/auth`, `/features/account` (profile, addresses) |
| catalog | `/features/catalog` |
| cart | `/features/cart` |
| checkout | `/features/checkout`, `/features/account/orders`, `/features/admin/orders` |
| inventory | `/features/admin/inventory` (+ PDP availability display via catalog reads) |
| reporting | `/features/admin/dashboard` |
| platform | `/api` client + `/app` providers (cross-cutting) |

---

## 2. Backend Architecture Layers

Each module follows the same internal layering:

```
<module>/
├── web/           → REST controllers, request/response DTOs, @Valid bindings, DTO mappers
├── service/       → Business rules, transactions, orchestration, domain exceptions
├── repository/    → Spring Data JPA repositories + named/derived queries
└── domain/        → Entities, enums, value objects
```

### 2.1 Layer Responsibilities

| Layer | Does | Never Does |
|---|---|---|
| **Controller** (`web/`) | Bind/validate DTOs, call one application service, map result to response DTO, set HTTP status | Contain business rules, touch entities of other modules, catch-and-swallow errors, build responses from entities directly |
| **Service** (`service/`) | Business rules, authorization scoping (ownership checks), transactions (`@Transactional`), idempotency, write history/ledger rows | Know HTTP, render messages for users, perform raw SQL strings |
| **Repository** (`repository/`) | Queries via JPA/JPQL only | Business logic, cross-module writes |
| **DTO Mappers** (in `web/`) | Entity ↔ DTO conversion (manual mapper functions — no MapStruct) | — |
| **Domain** (`domain/`) | Entities, enums, value objects, domain exceptions | Framework-specific annotations where avoidable |

### 2.2 Cross-Cutting Rules

1. **Entities never leave the service layer** — prevents lazy-loading surprises and mass assignment (SEC-06).
2. **Whitelist binding** — request DTOs contain only client-settable fields; `role`, `status`, `price`, `stock`, `total`, `placedAt` are never client-writable.
3. **Transactions** — `@Transactional` at service entry points only; external HTTP calls (Stripe) happen **outside** DB transactions with compensating actions.
4. **Module boundaries enforced** — ArchUnit tests fail the build on violations.

### 2.3 Request Lifecycle (Single GET, Happy Path)

```
Filter (requestId → MDC)
  → Security filters (CSRF, session parse)
    → Controller (DTO bind + @Valid)
      → Service (@Transactional, business rules)
        → Repository (JPQL)
          → DTO mapping
            → Response (+ X-Request-Id header)
              → Log line with requestId, route, status, duration
```

### 2.4 Cross-Cutting Services (Platform Module)

| Service | Responsibility | SRS Refs |
|---|---|---|
| Error advice | Single `@RestControllerAdvice` → uniform error envelope | FR-GEN-01, ERR-01 |
| Request-ID filter | UUID per request → MDC + response header `X-Request-Id` | NFR-09 |
| Rate-limit filter | In-memory sliding window: auth endpoints 5/15 min per email+IP | FR-AUTH-08, SEC-16 |
| Security config | Cookie/CSRF/header rules, URL matchers | SEC-03/04/05 |
| Storage port | `FileStorage` interface → local disk impl (S3 seam later) | NFR-15 |
| Health | `GET /api/v1/health` → DB connectivity, 200/503 | FR-GEN-06 |
| Config binder | Typed `@ConfigurationProperties` from env vars | SEC-12 |
| Seed runner | Idempotent catalog/accounts bootstrap | FR-GEN-09 |

---

## 3. REST API Structure

### 3.1 Conventions

| Rule | Detail |
|---|---|
| Base path | `/api/v1` (versioned prefix) |
| Format | JSON, UTF-8 |
| Auth | Session cookie (httpOnly, SameSite=Lax, Secure in prod) |
| CSRF | Double-submit: `XSRF-TOKEN` cookie → `X-XSRF-TOKEN` header on POST/PUT/PATCH/DELETE |
| Errors | Single envelope `{code, message, fieldErrors[], requestId}` on every non-2xx |
| Lists | `{items[], page, size, total, totalPages}`; page 0-based, default size 24, max 48 |
| Money | Integer minor units (cents) everywhere; client formats for display |
| Idempotency | `Idempotency-Key` header (UUID) on `POST /orders` |
| Correlation | Response header `X-Request-Id` = log `requestId` |

### 3.2 Endpoint Map (V1)

| Area | Method + Path | Auth | Description |
|---|---|---|---|
| **Auth** | `POST /api/v1/auth/register` | Public | Register new customer |
| | `POST /api/v1/auth/login` | Public | Login (sets session cookie) |
| | `POST /api/v1/auth/logout` | Cookie | Logout (clears session) |
| | `GET /api/v1/auth/session` | Cookie | Get current session/user |
| | `POST /api/v1/auth/forgot-password` | Public | Request password reset email |
| | `POST /api/v1/auth/reset-password` | Public | Reset password with token |
| **Users** | `GET /api/v1/me` | Customer | Get own profile |
| | `PATCH /api/v1/me` | Customer | Update profile (name only) |
| | `POST /api/v1/me/password` | Customer | Change password |
| **Addresses** | `GET /api/v1/me/addresses` | Customer | List saved addresses |
| | `POST /api/v1/me/addresses` | Customer | Create address |
| | `PUT /api/v1/me/addresses/{id}` | Customer | Update address |
| | `DELETE /api/v1/me/addresses/{id}` | Customer | Delete address |
| | `POST /api/v1/me/addresses/{id}/default` | Customer | Set default address |
| **Categories** | `GET /api/v1/categories` | Public | List all categories with counts |
| **Products** | `GET /api/v1/products` | Public | List/search/filter products (paginated) |
| | `GET /api/v1/products/{slug}` | Public | Get product detail by slug |
| | `GET /api/v1/products/{slug}/related` | Public | Related products (same category) |
| **Cart** | `GET /api/v1/cart` | Cookie (guest/user) | Get current cart |
| | `POST /api/v1/cart/items` | Cookie | Add item to cart |
| | `PATCH /api/v1/cart/items/{lineId}` | Cookie | Update quantity |
| | `DELETE /api/v1/cart/items/{lineId}` | Cookie | Remove item |
| | `DELETE /api/v1/cart` | Cookie | Clear cart |
| **Checkout** | `POST /api/v1/orders` | Customer | Place order (Idempotency-Key) |
| | `GET /api/v1/orders/{number}` | Customer | Get order detail |
| | `GET /api/v1/orders` | Customer | List customer orders |
| | `POST /api/v1/orders/{number}/cancel` | Customer | Cancel order (PENDING only) |
| | `GET /api/v1/shipping-methods` | Public | List shipping methods |
| **Payments** | `POST /api/v1/payments/client-secret` | Customer | Create payment intent |
| | `POST /api/v1/webhooks/stripe` | Signature | Stripe webhook handler |
| **Admin Dashboard** | `GET /api/v1/admin/dashboard` | STAFF/ADMIN | KPIs, top products, recent orders, low-stock |
| **Admin Products** | `GET /api/v1/admin/products` | STAFF/ADMIN | List all products (admin) |
| | `POST /api/v1/admin/products` | STAFF/ADMIN | Create product |
| | `GET /api/v1/admin/products/{id}` | STAFF/ADMIN | Get product detail |
| | `PATCH /api/v1/admin/products/{id}` | STAFF/ADMIN | Update product |
| | `DELETE /api/v1/admin/products/{id}` | STAFF/ADMIN | Archive product |
| | `POST /api/v1/admin/products/{id}/variants` | STAFF/ADMIN | Create variant |
| | `PATCH /api/v1/admin/products/{id}/variants/{variantId}` | STAFF/ADMIN | Update variant |
| | `DELETE /api/v1/admin/products/{id}/variants/{variantId}` | STAFF/ADMIN | Remove variant |
| | `POST /api/v1/admin/products/{id}/images` | STAFF/ADMIN | Upload image |
| | `DELETE /api/v1/admin/products/{id}/images/{imageId}` | STAFF/ADMIN | Remove image |
| **Admin Categories** | `GET/POST /api/v1/admin/categories` | STAFF/ADMIN | List/create categories |
| | `PATCH/DELETE /api/v1/admin/categories/{id}` | STAFF/ADMIN | Update/delete category |
| **Admin Inventory** | `GET /api/v1/admin/inventory` | STAFF/ADMIN | List stock levels |
| | `POST /api/v1/admin/inventory/{variantId}/adjustments` | STAFF/ADMIN | Manual stock adjustment |
| | `GET /api/v1/admin/inventory/low-stock` | STAFF/ADMIN | Low-stock alerts |
| **Admin Orders** | `GET /api/v1/admin/orders` | STAFF/ADMIN | List all orders |
| | `GET /api/v1/admin/orders/{number}` | STAFF/ADMIN | Order detail |
| | `POST /api/v1/admin/orders/{number}/status` | STAFF/ADMIN | Transition order status |
| | `POST /api/v1/admin/orders/{number}/refund` | STAFF/ADMIN | Process refund |
| **Admin Customers** | `GET /api/v1/admin/customers` | STAFF/ADMIN | List customers |
| | `GET /api/v1/admin/customers/{id}` | STAFF/ADMIN | Customer detail + orders |
| | `PATCH /api/v1/admin/customers/{id}` | ADMIN | Block/unblock, change role |
| **Platform** | `GET /api/v1/health` | Public | Health check (DB connectivity) |

### 3.3 Request/Response Conventions

- **Lists**: `{ items[], page, size, total, totalPages }`
- **Money**: Integer minor units (cents) everywhere
- **Dates**: ISO-8601 strings in UTC (`2026-11-04T09:30:00.000Z`)
- **Errors**: `{ code, message, fieldErrors[], requestId }`
- **Auth**: Session cookie (httpOnly) + CSRF double-submit

---

## 4. Security Strategy

### 4.1 Authentication Model

| Aspect | Decision | Source |
|---|---|---|
| Mechanism | JWT signed (HS256) in httpOnly cookie `shoply_session` | SEC-03, DEC-18 |
| CSRF | Double-submit token cookie + `X-XSRF-TOKEN` header | SEC-04 |
| Session invalidation | `tokenVersion` in user table; logout increments version | ARCH §8.1 |
| Password hashing | BCrypt (strength 12) | SEC-01 |
| Password rules | Min 8 chars, 1 uppercase, 1 digit (mirrors frontend) | FR-AUTH-01, SRS §10.2 |

### 4.2 Roles and Authorization

| Role | Access |
|---|---|
| **CUSTOMER** | Storefront + account area (`/me/**`, `/orders/**`) |
| **STAFF** | Admin product, inventory, order management |
| **ADMIN** | Everything STAFF + customer management, settings, refunds |

### 4.3 Authorization Rules

1. **URL-level**: Spring Security filter chain defines matchers:
   - `/api/v1/auth/**` → public
   - `/api/v1/admin/**` → STAFF/ADMIN
   - `/api/v1/me/**`, `/api/v1/orders/**` → CUSTOMER
   - `/api/v1/webhooks/stripe` → signature-verified (no cookie/CSRF)
   - Everything else → authenticated

2. **Method-level**: `@PreAuthorize` annotations on controller methods for fine-grained control.

3. **Ownership scoping**: Services enforce that users can only access their own orders, addresses, and cart. Staff/admin can access any resource within their role.

4. **Whitelist binding**: Request DTOs contain only client-settable fields. `role`, `status`, `price`, `stock`, `total`, `placedAt` are never client-writable.

### 4.4 Security Headers

- `Content-Security-Policy`: strict (no inline scripts)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security` (HSTS) in production
- `Referrer-Policy: strict-origin-when-cross-origin`

### 4.5 Rate Limiting

- Auth endpoints: 5 requests per 15 minutes per email+IP
- Expensive endpoints (checkout, admin): coarse per-IP limit
- In-memory sliding window (no external Redis in V1)

---

## 5. Backend Folder Structure

Base package: `com.shoply`

```
backend/
├── pom.xml
├── mvnw / mvnw.cmd
├── src/
│   ├── main/
│   │   ├── java/com/shoply/
│   │   │   ├── ShoplyApplication.java          ← @SpringBootApplication entry point
│   │   │   │
│   │   │   ├── platform/                       ← infrastructure (depends on nothing)
│   │   │   │   ├── config/
│   │   │   │   │   ├── SecurityConfig.java     ← Spring Security filter chain
│   │   │   │   │   ├── CorsConfig.java         ← CORS allowlist
│   │   │   │   │   ├── AppConfig.java          ← @ConfigurationProperties
│   │   │   │   │   └── WebConfig.java          ← MVC config, interceptors
│   │   │   │   ├── error/
│   │   │   │   │   ├── GlobalExceptionHandler.java  ← @RestControllerAdvice
│   │   │   │   │   ├── ErrorEnvelope.java      ← {code, message, fieldErrors, requestId}
│   │   │   │   │   └── DomainException.java    ← base exception + subclasses
│   │   │   │   ├── filter/
│   │   │   │   │   ├── RequestIdFilter.java    ← UUID → MDC + response header
│   │   │   │   │   └── RateLimitFilter.java    ← sliding window rate limiter
│   │   │   │   ├── health/
│   │   │   │   │   └── HealthController.java   ← GET /api/v1/health
│   │   │   │   ├── storage/
│   │   │   │   │   ├── FileStorage.java        ← interface (port)
│   │   │   │   │   └── LocalFileStorage.java   ← local disk implementation
│   │   │   │   └── seed/
│   │   │   │       └── SeedRunner.java         ← idempotent catalog seed
│   │   │   │
│   │   │   ├── identity/                      ← auth, users, addresses
│   │   │   │   ├── domain/
│   │   │   │   │   ├── User.java               ← entity
│   │   │   │   │   ├── Role.java               ← enum (CUSTOMER, STAFF, ADMIN)
│   │   │   │   │   └── Address.java            ← entity
│   │   │   │   ├── repository/
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   └── AddressRepository.java
│   │   │   │   ├── service/
│   │   │   │   │   ├── AuthService.java        ← login, register, logout, session
│   │   │   │   │   ├── UserService.java        ← profile, password change
│   │   │   │   │   └── AddressService.java     ← CRUD + default handling
│   │   │   │   └── web/
│   │   │   │       ├── AuthController.java     ← /auth/* endpoints
│   │   │   │       ├── UserController.java     ← /me endpoints
│   │   │   │       ├── AddressController.java  ← /me/addresses endpoints
│   │   │   │       ├── dto/
│   │   │   │       │   ├── RegisterRequest.java
│   │   │   │       │   ├── LoginRequest.java
│   │   │   │       │   ├── UserResponse.java
│   │   │   │       │   ├── AddressRequest.java
│   │   │   │       │   └── AddressResponse.java
│   │   │   │       └── mapper/
│   │   │   │           └── IdentityMapper.java
│   │   │   │
│   │   │   ├── catalog/                        ← categories, products, variants, images
│   │   │   │   ├── domain/
│   │   │   │   │   ├── Category.java
│   │   │   │   │   ├── Product.java
│   │   │   │   │   ├── Variant.java
│   │   │   │   │   └── ProductImage.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── CategoryRepository.java
│   │   │   │   │   ├── ProductRepository.java
│   │   │   │   │   └── VariantRepository.java
│   │   │   │   ├── service/
│   │   │   │   │   ├── CatalogService.java     ← listing, search, filter, detail
│   │   │   │   │   ├── ProductService.java     ← CRUD (admin)
│   │   │   │   │   └── CategoryService.java   ← CRUD (admin)
│   │   │   │   └── web/
│   │   │   │       ├── CatalogController.java  ← /products, /categories
│   │   │   │       ├── AdminProductController.java  ← /admin/products
│   │   │   │       ├── AdminCategoryController.java ← /admin/categories
│   │   │   │       ├── dto/
│   │   │   │       │   ├── ProductListItem.java
│   │   │   │       │   ├── ProductDetail.java
│   │   │   │       │   ├── CategoryResponse.java
│   │   │   │       │   ├── ProductRequest.java
│   │   │   │       │   └── VariantRequest.java
│   │   │   │       └── mapper/
│   │   │   │           └── CatalogMapper.java
│   │   │   │
│   │   │   ├── cart/                           ← server-side carts
│   │   │   │   ├── domain/
│   │   │   │   │   ├── Cart.java
│   │   │   │   │   └── CartItem.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── CartRepository.java
│   │   │   │   │   └── CartItemRepository.java
│   │   │   │   ├── service/
│   │   │   │   │   └── CartService.java       ← CRUD, merge, totals
│   │   │   │   └── web/
│   │   │   │       ├── CartController.java    ← /cart endpoints
│   │   │   │       ├── dto/
│   │   │   │       │   ├── CartResponse.java
│   │   │   │       │   └── CartItemRequest.java
│   │   │   │       └── mapper/
│   │   │   │           └── CartMapper.java
│   │   │   │
│   │   │   ├── checkout/                       ← orders, payments, state machine
│   │   │   │   ├── domain/
│   │   │   │   │   ├── Order.java
│   │   │   │   │   ├── OrderItem.java
│   │   │   │   │   ├── OrderStatus.java       ← enum (PENDING, PAID, SHIPPED, DELIVERED, CANCELLED, EXPIRED, REFUNDED)
│   │   │   │   │   ├── OrderStatusHistory.java
│   │   │   │   │   ├── Payment.java
│   │   │   │   │   ├── PaymentStatus.java     ← enum
│   │   │   │   │   └── PaymentWebhookEvent.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── OrderRepository.java
│   │   │   │   │   ├── OrderItemRepository.java
│   │   │   │   │   ├── OrderStatusHistoryRepository.java
│   │   │   │   │   ├── PaymentRepository.java
│   │   │   │   │   └── PaymentWebhookEventRepository.java
│   │   │   │   ├── service/
│   │   │   │   │   ├── CheckoutService.java   ← place order (transactional)
│   │   │   │   │   ├── OrderService.java      ← get, list, cancel, state machine
│   │   │   │   │   ├── PaymentGateway.java    ← interface (port)
│   │   │   │   │   ├── StripePaymentGateway.java  ← adapter
│   │   │   │   │   ├── MockPaymentGateway.java    ← adapter (default for dev)
│   │   │   │   │   ├── WebhookProcessor.java  ← signature verify + apply
│   │   │   │   │   └── OrderExpiryJob.java    ← @Scheduled 30-min expiry
│   │   │   │   └── web/
│   │   │   │       ├── OrderController.java   ← /orders endpoints
│   │   │   │       ├── AdminOrderController.java ← /admin/orders
│   │   │   │       ├── WebhookController.java ← /webhooks/stripe
│   │   │   │       ├── dto/
│   │   │   │       │   ├── PlaceOrderRequest.java
│   │   │   │       │   ├── OrderResponse.java
│   │   │   │       │   ├── OrderDetailResponse.java
│   │   │   │       │   ├── OrderItemResponse.java
│   │   │   │       │   ├── OrderStatusUpdateRequest.java
│   │   │   │       │   └── PaymentResponse.java
│   │   │   │       └── mapper/
│   │   │   │           └── CheckoutMapper.java
│   │   │   │
│   │   │   ├── inventory/                      ← stock management
│   │   │   │   ├── domain/
│   │   │   │   │   ├── StockMovement.java
│   │   │   │   │   └── MovementReason.java    ← enum
│   │   │   │   ├── repository/
│   │   │   │   │   └── StockMovementRepository.java
│   │   │   │   ├── service/
│   │   │   │   │   ├── InventoryService.java  ← reserve, release, adjust
│   │   │   │   │   └── StockPort.java         ← interface consumed by checkout
│   │   │   │   └── web/
│   │   │   │       ├── InventoryController.java ← /admin/inventory
│   │   │   │       ├── dto/
│   │   │   │       │   ├── StockLevelResponse.java
│   │   │   │       │   └── StockAdjustmentRequest.java
│   │   │   │       └── mapper/
│   │   │   │           └── InventoryMapper.java
│   │   │   │
│   │   │   └── reporting/                      ← admin dashboard (read-only)
│   │   │       ├── service/
│   │   │       │   └── ReportingService.java   ← KPIs, top products, recent orders
│   │   │       └── web/
│   │   │           ├── DashboardController.java ← /admin/dashboard
│   │   │           └── dto/
│   │   │               └── DashboardResponse.java
│   │   │
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-local.yml
│   │       ├── application-demo.yml
│   │       └── db/migration/
│   │           └── V1__init_schema.sql         ← Flyway (implementation phase)
│   │
│   └── test/
│       └── java/com/shoply/
│           ├── ShoplyApplicationTests.java     ← boot test
│           ├── identity/ ...                   ← module tests
│           ├── catalog/ ...
│           ├── checkout/ ...
│           └── (Testcontainers for real MySQL)
│
├── .env.example
├── .env (git-ignored)
├── pom.xml
├── mvnw / mvnw.cmd
└── src/main/resources/db/migration/
```

### Where Each Layer Belongs

| Layer | Location | Example |
|---|---|---|
| **Controller** | `<module>/web/` | `identity/web/AuthController.java` |
| **Service** | `<module>/service/` | `checkout/service/CheckoutService.java` |
| **Repository** | `<module>/repository/` | `catalog/repository/ProductRepository.java` |
| **Entity** | `<module>/domain/` | `checkout/domain/Order.java` |
| **DTO** | `<module>/web/dto/` | `identity/web/dto/LoginRequest.java` |
| **Mapper** | `<module>/web/mapper/` | `catalog/web/mapper/CatalogMapper.java` |
| **Exception** | `<module>/service/` (domain exceptions) + `platform/error/` (global handler) | `checkout/service/OrderNotFoundException.java` |
| **Security** | `platform/config/` + `platform/filter/` | `platform/config/SecurityConfig.java` |

---

## 6. Database Integration

### 6.1 Connection Configuration

```yaml
# application.yml (common)
spring:
  datasource:
    url: ${DB_URL:jdbc:mysql://localhost:3306/shoply?useSSL=false&serverTimezone=UTC}
    username: ${DB_USERNAME:shoply_app}
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        jdbc.time_zone: UTC
        format_sql: false
  flyway:
    enabled: true
    user: ${FLYWAY_USER:shoply_migrator}
    password: ${FLYWAY_PASSWORD}
    locations: classpath:db/migration
    clean-disabled: true
```

### 6.2 Environment Variables

| Variable | Purpose | Example (dev) |
|---|---|---|
| `DB_URL` | JDBC connection string | `jdbc:mysql://localhost:3306/shoply` |
| `DB_USERNAME` | App runtime user (DML only) | `shoply_app` |
| `DB_PASSWORD` | App user password | (generated per machine, git-ignored) |
| `FLYWAY_USER` | Migration user (DDL) | `shoply_migrator` |
| `FLYWAY_PASSWORD` | Migration user password | (generated per machine, git-ignored) |
| `JWT_SECRET` | JWT signing key (≥ 32 bytes) | (generated per machine) |
| `CORS_ALLOWED_ORIGINS` | Frontend origin allowlist | `http://localhost:5173` |
| `UPLOAD_DIR` | Product image storage path | `./uploads` |
| `PAYMENT_PROVIDER` | `mock` or `stripe` | `mock` (default for dev) |
| `STRIPE_SECRET_KEY` | Stripe API key (if stripe provider) | (optional, dev only) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | (optional, dev only) |

### 6.3 Hibernate Configuration

- **`ddl-auto: validate`** — Hibernate validates the schema against entities on boot; mismatch = boot failure (intended safety net).
- **No `ddl-auto: update` or `create`** in any profile — Flyway owns all DDL.
- **Naming strategy** — `SpringPhysicalNamingStrategy` maps camelCase → snake_case automatically (no `@Column(name=...)` needed).
- **Time zone** — UTC (`jdbc.time_zone: UTC`); application stores all timestamps in UTC.
- **Connection pool** — HikariCP (Spring Boot default), configured for demo scale.

### 6.4 Migration Strategy (Flyway)

- **Location**: `src/main/resources/db/migration/`
- **Naming**: `V1__init_schema.sql`, `V2__seed_data.sql`, etc.
- **Forward-only**: never edit an applied migration; fix with a new one.
- **Timing**: On boot, runs under migrator credentials.
- **Validation**: Hibernate `ddl-auto=validate` checks the result.
- **Seed**: Separate idempotent seed runner (not a migration) — runs under `local`/`demo` profiles only.

---

## 7. Development Sequence

### Phase 1: Project Setup (Week 1)
1. Create Maven project with Spring Boot 3.x / Java 21
2. Configure `pom.xml` with dependencies (Spring Web, Security, Data JPA, Validation, Flyway, MySQL Driver)
3. Create `ShoplyApplication.java` entry point
4. Create `application.yml`, `application-local.yml`, `application-demo.yml`
5. Create `.env.example` with placeholder values
6. Set up Maven wrapper (`mvnw.cmd`)
7. Create boot test (`ShoplyApplicationTests.java`)

### Phase 2: Database Integration (Week 1–2)
8. Set up Docker Compose for MySQL 8
9. Create database bootstrap SQL (users, schema, grants)
10. Create `V1__init_schema.sql` Flyway migration (14 tables from DB design)
11. Configure Hibernate `ddl-auto=validate`
12. Verify boot + schema validation

### Phase 3: Entity & Repository Layer (Week 2)
13. Create JPA entities for all 14 tables (package-by-feature, domain subpackage)
14. Create Spring Data JPA repositories with derived queries
15. Create `V2__seed_data.sql` or seed runner for demo catalog
16. Write repository-level tests with Testcontainers

### Phase 4: Authentication & Security (Week 2–3)
17. Implement `platform` module: security config, error advice, request-ID filter, rate limiter, health endpoint, storage port
18. Implement `identity` module: User entity, UserRepository, AuthService (register, login, logout, session), UserController
19. Implement JWT in httpOnly cookie + CSRF double-submit
20. Implement role-based authorization (CUSTOMER, STAFF, ADMIN)
21. Write auth tests (unit + integration with Testcontainers)

### Phase 5: Product APIs (Week 3–4)
22. Implement `catalog` module: Category, Product, Variant, ProductImage entities
23. Implement CatalogService (listing, search, filter, sort, pagination)
24. Implement ProductController (public + admin)
25. Implement CategoryController
26. Implement product image upload (local file storage)
27. Write catalog tests

### Phase 6: Cart & Wishlist APIs (Week 4)
28. Implement `cart` module: Cart, CartItem entities
29. Implement CartService (add, update, remove, clear, merge guest cart on login)
30. Implement CartController
31. Write cart tests (including guest-to-user merge)

### Phase 7: Order APIs (Week 4–5)
32. Implement `checkout` module: Order, OrderItem, OrderStatusHistory, Payment, PaymentWebhookEvent entities
33. Implement CheckoutService (place order with transactional stock decrement + payment intent)
34. Implement OrderService (get, list, cancel, state machine transitions)
35. Implement PaymentGateway port + Stripe/mock adapters
36. Implement webhook processing (signature verification, idempotent handling)
37. Implement order expiry job (@Scheduled, 30-min timeout)
38. Implement admin order endpoints (list, detail, status transition, refund)
39. Write checkout tests (transactional integrity, idempotency, state machine)

### Phase 8: Inventory APIs (Week 5)
40. Implement `inventory` module: StockMovement entity
41. Implement InventoryService (reserve, release, adjust, low-stock queries)
42. Implement InventoryController (admin)
43. Write inventory tests (conditional stock updates, ledger integrity)

### Phase 9: Admin APIs (Week 5–6)
44. Implement `reporting` module: Dashboard KPIs, top products, recent orders, low-stock count
45. Implement admin product/category/inventory/customer management endpoints
46. Write admin tests (role-gated access, CRUD operations)

### Phase 10: Frontend Integration (Week 6–7)
47. Replace temporary frontend data with API calls (TanStack Query)
48. Implement API client layer (`/api` with envelope parsing, CSRF, 401 handling)
49. Wire up cart, checkout, auth, account pages to real APIs
50. Implement loading/empty/error states (Skeleton, EmptyState, ErrorState)
51. Wire up admin console (if approved)

### Phase 11: Testing (Week 7)
52. Frontend: Vitest + RTL (API client, product card states, checkout guard, money formatter)
53. Backend: JUnit 5 + Testcontainers (real MySQL)
54. Integration tests: full checkout flow, auth flow, admin operations
55. Security tests: OWASP Top 10 checklist (SEC-20)

### Phase 12: Deployment (Week 7–8)
56. Docker image build for Spring Boot
57. CI/CD pipeline (GitHub Actions)
58. Deploy to staging
59. Production deployment
60. Smoke tests

---

## 8. Summary & Approval

### What This Plan Covers

This backend architecture plan defines:

1. **7 backend modules** (platform, identity, catalog, cart, checkout, inventory, reporting) with clear ownership and acyclic dependencies
2. **Layered architecture** (controller → service → repository → entity → DTO → mapper) with enforced rules
3. **~44 REST endpoints** across 18 groups, following REST conventions
4. **Security strategy**: JWT in httpOnly cookie, CSRF double-submit, BCrypt passwords, 3 roles (CUSTOMER/STAFF/ADMIN), rate limiting
5. **Clean Maven project structure** with package-by-feature layout
6. **Database integration**: MySQL 8, Flyway migrations, separate app/migrator users, `ddl-auto=validate`
7. **12-phase development sequence** from project setup to deployment

### Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Architecture style | Modular monolith | Single DB → real ACID transactions; solo developer; portfolio scale |
| Auth mechanism | JWT in httpOnly cookie + CSRF | Security best practice (SEC-03/04) |
| Money storage | DECIMAL (per DBQ-01) | Exact arithmetic; conflicts with FR-GEN-08 minor units — needs resolution |
| Stock mutations | Conditional UPDATE + ledger | Atomic, auditable, prevents overselling |
| Payment gateway | Port interface (Stripe/mock) | Testable, swappable |
| Image storage | Local disk (S3 seam later) | V1 simplicity; interface allows swap |
| Module boundaries | ArchUnit-enforced | Prevents accidental coupling |

### Approval Required

This document is a planning specification. On approval, implementation begins with Phase 1 (Spring Boot project setup). No backend code has been written yet.

---

**Status: Awaiting approval before implementation.**

**Do not proceed to backend implementation until this plan is approved.**