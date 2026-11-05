package com.shoply.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * ProductVariant entity — the sellable SKU (size × color).
 *
 * Per DATABASE_DESIGN.md §4.2:
 * - Globally unique SKU (BR-07).
 * - size/color from controlled vocabularies (DEC-15d, app-enforced).
 * - price_override: if set, overrides product base price (BR-03).
 * - stock: current on-hand quantity, non-negative (BR-08).
 * - is_active: deactivation stops sales but never erases history (FR-PROD-05.3).
 * - Stock is owned by inventory module (§5.3 of SYSTEM_ARCHITECTURE.md).
 */
@Entity
@Table(name = "variants")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotBlank
    @Size(max = 40)
    @Column(name = "sku", nullable = false, unique = true, length = 40)
    private String sku;

    @NotBlank
    @Size(max = 40)
    @Column(name = "size", nullable = false, length = 40)
    private String size;

    @NotBlank
    @Size(max = 40)
    @Column(name = "color", nullable = false, length = 40)
    private String color;

    @Column(name = "price_override", precision = 10, scale = 2)
    private BigDecimal priceOverride;

    @Column(name = "stock", nullable = false)
    private int stock = 0;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // --- Constructors ---

    protected ProductVariant() {
        // JPA requires no-arg constructor
    }

    public ProductVariant(Product product, String sku, String size, String color) {
        this.product = product;
        this.sku = sku;
        this.size = size;
        this.color = color;
        this.stock = 0;
        this.active = true;
    }

    // --- Lifecycle callbacks ---

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public BigDecimal getPriceOverride() {
        return priceOverride;
    }

    public void setPriceOverride(BigDecimal priceOverride) {
        this.priceOverride = priceOverride;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
