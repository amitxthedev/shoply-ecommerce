package com.shoply.exception;

/**
 * DuplicateResourceException — thrown when a resource already exists (e.g., duplicate email, SKU).
 * Maps to HTTP 409 Conflict.
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }

    public DuplicateResourceException(String resourceType, String field, String value) {
        super(resourceType + " already exists with " + field + ": " + value);
    }
}
