package com.shoply.entity;

/**
 * User role enumeration.
 *
 * Per the approved database design (DATABASE_DESIGN.md §3.2), roles are NOT
 * stored in a separate table. Three fixed roles (CUSTOMER, STAFF, ADMIN) are
 * stored as a single VARCHAR column on the users table with a CHECK constraint.
 * A separate roles table would add joins with zero flexibility gain at
 * single-vendor scale (SRS §5).
 */
public enum Role {
    CUSTOMER,
    STAFF,
    ADMIN
}
