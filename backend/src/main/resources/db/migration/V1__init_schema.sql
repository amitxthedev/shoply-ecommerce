-- V1__init_schema.sql
-- Shoply initial schema migration
-- This file will contain the full DDL in the entity implementation phase.
-- For now, this is a placeholder to verify Flyway is configured correctly.

-- Verify database connectivity by creating a simple placeholder.
-- This will be replaced with actual table definitions in the next phase.
CREATE TABLE IF NOT EXISTS _schema_placeholder (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
