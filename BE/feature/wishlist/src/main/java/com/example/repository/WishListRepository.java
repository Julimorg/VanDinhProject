package com.example.repository;

import com.example.persistence.entity.WishList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface WishListRepository extends JpaRepository<WishList, String> {

    Page<WishList> findByUserId(String userId, Pageable pageable);

    Optional<WishList> findByUserIdAndProductProductId(String userId, String productId);

    boolean existsByUserIdAndProductProductId(String userId, String productId);

    void deleteByUserIdAndProductProductId(String userId, String productId);

    @Query("SELECT COUNT(w) FROM WishList w WHERE w.product.productId = :productId")
    long countByProductId(@Param("productId") String productId);


}
