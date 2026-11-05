package com.shoply.dto.catalog;

import java.math.BigDecimal;

/**
 * ProductVariantResponse — DTO for variant responses (storefront + admin).
 */
public class VariantResponse {

    private Long id;
    private String sku;
    private String size;
    private String color;
    private BigDecimal priceOverride;
    private int stock;
    private boolean active;

    // --- Constructors ---

    public VariantResponse() {
    }

    public VariantResponse(Long id, String sku, String size, String color, BigDecimal priceOverride, int stock, boolean active) {
        this.id = id;
        this.sku = sku;
        this.size = size;
        this.color = color;
        this.priceOverride = priceOverride;
        this.stock = stock;
        this.active = active;
    }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}
