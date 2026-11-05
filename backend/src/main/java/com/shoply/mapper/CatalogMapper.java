package com.shoply.mapper;

import com.shoply.dto.catalog.CategoryResponse;
import com.shoply.dto.catalog.ProductResponse;
import com.shoply.dto.catalog.VariantResponse;
import com.shoply.entity.Category;
import com.shoply.entity.Product;
import com.shoply.entity.ProductVariant;

import java.util.List;
import java.util.stream.Collectors;

/**
 * CatalogMapper — manual mapping between Catalog entities and DTOs.
 * No MapStruct (AR-DEC-08: manual mapper functions).
 */
public class CatalogMapper {

    public static CategoryResponse toCategoryResponse(Category category) {
        if (category == null) return null;
        return new CategoryResponse(
            category.getId(),
            category.getName(),
            category.getSlug(),
            category.getDescription(),
            category.getDisplayOrder(),
            category.getStatus().name(),
            category.getCreatedAt(),
            category.getUpdatedAt()
        );
    }

    public static ProductResponse toProductResponse(Product product) {
        if (product == null) return null;
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setCategoryId(product.getCategory() != null ? product.getCategory().getId() : null);
        response.setCategoryName(product.getCategory() != null ? product.getCategory().getName() : null);
        response.setName(product.getName());
        response.setSlug(product.getSlug());
        response.setDescription(product.getDescription());
        response.setBasePrice(product.getBasePrice());
        response.setCompareAtPrice(product.getCompareAtPrice());
        response.setStatus(product.getStatus().name());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        if (product.getVariants() != null) {
            response.setVariants(product.getVariants().stream()
                .map(CatalogMapper::toVariantResponse)
                .collect(Collectors.toList()));
        }
        return response;
    }

    public static VariantResponse toVariantResponse(ProductVariant variant) {
        if (variant == null) return null;
        return new VariantResponse(
            variant.getId(),
            variant.getSku(),
            variant.getSize(),
            variant.getColor(),
            variant.getPriceOverride(),
            variant.getStock(),
            variant.isActive()
        );
    }

    public static List<CategoryResponse> toCategoryResponseList(List<Category> categories) {
        if (categories == null) return null;
        return categories.stream()
            .map(CatalogMapper::toCategoryResponse)
            .collect(Collectors.toList());
    }

    public static List<ProductResponse> toProductResponseList(List<Product> products) {
        if (products == null) return null;
        return products.stream()
            .map(CatalogMapper::toProductResponse)
            .collect(Collectors.toList());
    }
}
