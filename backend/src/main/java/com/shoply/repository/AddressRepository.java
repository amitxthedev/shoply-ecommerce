package com.shoply.repository;

import com.shoply.entity.Address;
import com.shoply.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * AddressRepository — data access for Address entity (identity module).
 */
@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    /**
     * Find all addresses belonging to a user.
     */
    List<Address> findByUser(User user);

    /**
     * Find all addresses for a user by user ID.
     */
    List<Address> findByUserId(Long userId);

    /**
     * Find the default address for a user.
     */
    Optional<Address> findByUserAndIsDefaultTrue(User user);

    /**
     * Count addresses for a user (max 20 per BR-15).
     */
    long countByUser(User user);
}
