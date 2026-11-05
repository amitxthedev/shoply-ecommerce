package com.shoply.repository;

import com.shoply.entity.Category;
import com.shoply.entity.CategoryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * CategoryRepository — data access for Category entity (catalog module).
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Find a category by its URL slug.
     */
    Optional<Category> findBySlug(String slug);

    /**
     * Check whether a category with the given slug exists.
     */
    boolean existsBySlug(String slug);

    /**
     * Check whether a category with the given name exists.
     */
    boolean existsByName(String name);

    /**
     * Find all categories by status (e.g., ACTIVE only).
     */
    List<Category> findByStatus(CategoryStatus status);

    /**
     * Find all active categories ordered by display order.
     */
    List<Category> findByStatusOrderByDisplayOrderAsc(CategoryStatus status);
}
