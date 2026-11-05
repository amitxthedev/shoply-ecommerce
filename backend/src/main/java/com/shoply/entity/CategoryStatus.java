package com.shoply.entity;

/**
 * Category status enumeration.
 * ACTIVE: visible in storefront.
 * ARCHIVED: hidden, requires products to be reassigned first (FR-CAT-01).
 */
public enum CategoryStatus {
    ACTIVE,
    ARCHIVED
}
