package com.shoply.repository;

import com.shoply.entity.Product;
import com.shoply.entity.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * ProductRepository — data access for Product entity (catalog module).
 *
 * Supports listing, search, filter, sort, and pagination per API spec §12.4.
 * Uses JPQL queries to avoid N+1 problems via @EntityGraph where needed.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Find a product by its URL slug.
     */
    Optional<Product> findBySlug(String slug);

    /**
     * Check whether a product with the given slug exists.
     */
    boolean existsBySlug(String slug);

    /**
     * Find all products in a category.
     */
    Page<Product> findByCategory_Id(Long categoryId, Pageable pageable);

    /**
     * Find all products by status (e.g., PUBLISHED only).
     */
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    /**
     * Find products by category and status.
     */
    Page<Product> findByCategory_IdAndStatus(Long categoryId, ProductStatus status, Pageable pageable);

    /**
     * Search products by name (case-insensitive, contains).
     */
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    /**
     * Find products with base price between min and max.
     */
    Page<Product> findByBasePriceBetween(java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice, Pageable pageable);

    /**
     * Find published products by category slug.
     */
    @Query("SELECT p FROM Product p WHERE p.category.slug = :categorySlug AND p.status = 'PUBLISHED'")
    Page<Product> findPublishedByCategorySlug(@Param("categorySlug") String categorySlug, Pageable pageable);

    /**
     * Search published products by name (case-insensitive).
     */
    @Query("SELECT p FROM Product p WHERE p.status = 'PUBLISHED' AND LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Product> searchPublished(@Param("query") String query, Pageable pageable);
}
