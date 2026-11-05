package com.shoply.mapper;

import com.shoply.dto.catalog.CategoryResponse;
import com.shoply.dto.user.UserResponse;
import com.shoply.entity.Category;
import com.shoply.entity.User;

import java.util.List;
import java.util.stream.Collectors;

/**
 * IdentityMapper — manual mapping between User entity and DTOs.
 * No MapStruct (AR-DEC-08: manual mapper functions).
 */
public class IdentityMapper {

    public static UserResponse toUserResponse(com.shoply.entity.User user) {
        if (user == null) return null;
        return new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getFullName(),
            user.getRole().name(),
            user.getAccountStatus().name(),
            user.getCreatedAt()
        );
    }

    public static List<UserResponse> toUserResponseList(List<User> users) {
        if (users == null) return null;
        return users.stream()
            .map(IdentityMapper::toUserResponse)
            .collect(Collectors.toList());
    }
}
