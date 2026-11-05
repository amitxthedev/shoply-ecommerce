package com.shoply.entity;

/**
 * Account status enumeration.
 * ACTIVE: normal account.
 * BLOCKED: cannot authenticate or transact, but keeps all history (BR-20).
 */
public enum AccountStatus {
    ACTIVE,
    BLOCKED
}
