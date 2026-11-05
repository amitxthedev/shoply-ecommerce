package com.shoply.repository;

import com.shoply.entity.Product;
import com.shoply.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ProductVariantRepository — data access for ProductVariant entity (catalog + inventory module).
 */
@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    /**
     * Find a variant by its SKU.
     */
    Optional<ProductVariant> findBySku(String sku);

    /**
     * Check whether a variant with the given SKU exists.
     */
    boolean existsBySku(String sku);

    /**
     * Find all variants belonging to a product.
     */
    List<ProductVariant> findByProduct(Product product);

    /**
     * Find all variants for a product by product ID.
     */
    List<ProductVariant> findByProductId(Long productId);

    /**
     * Find active variants for a product.
     */
    List<ProductVariant> findByProductAndActiveTrue(Product product);

    /**
     * Find active variants for a product by product ID.
     */
    List<ProductVariant> findByProductIdAndActiveTrue(Long productId);

    /**
     * Find a variant by product, size, and color.
     */
    Optional<ProductVariant> findByProductAndSizeAndColor(Product product, String size, String color);
}
