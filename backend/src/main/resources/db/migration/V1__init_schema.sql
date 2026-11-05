-- V1__init_schema.sql
-- Shoply initial schema migration
-- Creates core tables: users, addresses, categories, products, variants, product_images
-- Based on DATABASE_DESIGN.md v1.0 and JPA entity classes.
-- Flyway: forward-only, never edit after applied.

-- ============================================================
-- Identity domain
-- ============================================================

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(254) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
    account_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    token_version INT NOT NULL DEFAULT 0,
    created_at DATETIME(3) NOT NULL,
    updated_at DATETIME(3) NOT NULL,
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role IN ('CUSTOMER', 'STAFF', 'ADMIN')),
    CONSTRAINT chk_users_account_status CHECK (account_status IN ('ACTIVE', 'BLOCKED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    label VARCHAR(60),
    full_name VARCHAR(100) NOT NULL,
    address_line_1 VARCHAR(120) NOT NULL,
    address_line_2 VARCHAR(120),
    city VARCHAR(60) NOT NULL,
    state VARCHAR(60) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    country VARCHAR(60) NOT NULL,
    is_default TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME(3) NOT NULL,
    updated_at DATETIME(3) NOT NULL,
    CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_addresses_user_default UNIQUE (user_id, is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- Catalog domain
-- ============================================================

CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    description VARCHAR(5000),
    display_order INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME(3) NOT NULL,
    updated_at DATETIME(3) NOT NULL,
    CONSTRAINT uq_categories_name UNIQUE (name),
    CONSTRAINT uq_categories_slug UNIQUE (slug),
    CONSTRAINT chk_categories_status CHECK (status IN ('ACTIVE', 'ARCHIVED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    description VARCHAR(5000),
    base_price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    version INT NOT NULL DEFAULT 0,
    created_at DATETIME(3) NOT NULL,
    updated_at DATETIME(3) NOT NULL,
    CONSTRAINT uq_products_slug UNIQUE (slug),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    CONSTRAINT chk_products_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    CONSTRAINT chk_products_compare_at CHECK (compare_at_price IS NULL OR compare_at_price > base_price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE variants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    sku VARCHAR(40) NOT NULL,
    size VARCHAR(40) NOT NULL,
    color VARCHAR(40) NOT NULL,
    price_override DECIMAL(10,2),
    stock INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL,
    updated_at DATETIME(3) NOT NULL,
    CONSTRAINT uq_variants_sku UNIQUE (sku),
    CONSTRAINT uq_variants_product_size_color UNIQUE (product_id, size, color),
    CONSTRAINT fk_variants_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    CONSTRAINT chk_variants_stock CHECK (stock >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE product_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    position INT NOT NULL DEFAULT 1,
    width INT,
    height INT,
    created_at DATETIME(3) NOT NULL,
    CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT chk_product_images_position CHECK (position BETWEEN 1 AND 8)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- Indexes
-- ============================================================

-- products
CREATE INDEX idx_products_category_status ON products(category_id, status);
CREATE INDEX idx_products_status ON products(status);

-- variants
CREATE INDEX idx_variants_product ON variants(product_id);
CREATE INDEX idx_variants_active ON variants(product_id, is_active);

-- product_images
CREATE INDEX idx_product_images_product_position ON product_images(product_id, position);

-- addresses
CREATE INDEX idx_addresses_user ON addresses(user_id);
