package com.shoply.entity;

/**
 * Product lifecycle status enumeration.
 * DRAFT: not visible in storefront.
 * PUBLISHED: visible and purchasable.
 * ARCHIVED: hidden, never deleted (BR-06).
 */
public enum ProductStatus {
    DRAFT,
    PUBLISHED,
    ARCHIVED
}
