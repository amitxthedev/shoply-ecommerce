package com.shoply.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/**
 * ProductImage entity — gallery rows per product (1–8 images, FR-PROD-06).
 *
 * Per DATABASE_DESIGN.md §4.2:
 * - Position 1 is the primary/listing image (no separate is_primary flag).
 * - image_path is a relative path in the local volume (V1).
 * - Optional width/height for aspect-ratio placeholders (EC-28).
 */
@Entity
@Table(name = "product_images")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotBlank
    @Size(max = 500)
    @Column(name = "image_path", nullable = false, length = 500)
    private String imagePath;

    @Size(max = 255)
    @Column(name = "alt_text", length = 255)
    private String altText;

    @Column(name = "position", nullable = false)
    private int position = 1;

    @Column(name = "width")
    private Integer width;

    @Column(name = "height")
    private Integer height;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // --- Constructors ---

    protected ProductImage() {
        // JPA requires no-arg constructor
    }

    public ProductImage(Product product, String imagePath, int position) {
        this.product = product;
        this.imagePath = imagePath;
        this.position = position;
    }

    // --- Lifecycle callbacks ---

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
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

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getAltText() {
        return altText;
    }

    public void setAltText(String altText) {
        this.altText = altText;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
