package com.shoply.repository;

import com.shoply.entity.Product;
import com.shoply.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ProductImageRepository — data access for ProductImage entity (catalog module).
 */
@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

    /**
     * Find all images for a product, ordered by position.
     */
    List<ProductImage> findByProductOrderByPositionAsc(Product product);

    /**
     * Find all images for a product by product ID, ordered by position.
     */
    List<ProductImage> findByProductIdOrderByPositionAsc(Long productId);

    /**
     * Find the primary image (position 1) for a product.
     */
    Optional<ProductImage> findByProductAndPosition(Product product, int position);
}
