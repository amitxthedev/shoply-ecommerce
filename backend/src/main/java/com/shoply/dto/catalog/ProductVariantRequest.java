package com.shoply.dto.catalog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/**
 * ProductVariantRequest — DTO for creating/updating a variant (admin).
 */
public class ProductVariantRequest {

    @NotBlank(message = "SKU is required")
    @Size(min = 3, max = 40, message = "SKU must be between 3 and 40 characters")
    private String sku;

    @NotBlank(message = "Size is required")
    @Size(max = 40, message = "Size must not exceed 40 characters")
    private String size;

    @NotBlank(message = "Color is required")
    @Size(max = 40, message = "Color must not exceed 40 characters")
    private String color;

    private BigDecimal priceOverride;

    @NotNull(message = "Stock is required")
    @PositiveOrZero(message = "Stock must be zero or greater")
    private Integer stock;

    private Boolean active;

    // --- Constructors ---

    public ProductVariantRequest() {
    }

    // --- Getters and Setters ---

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

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
