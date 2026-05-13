package com.example.repository;
import com.example.persistence.entity.Order;
import com.example.persistence.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String>, JpaSpecificationExecutor<Order> {

    Page<Order> findAllByUserId(String userId, Pageable pageable);

    Optional<Order> findByUserId(String userId);

    Page<Order> findByUser(User user, Pageable pageable);

    @Query("select o from Order o where o.user = ?1 and o.orderId = ?2")
    Optional<Order> findByUserAndOrderId(User user, String orderId);

    @Query(
            "select o from Order as o where o.user.id = :userId " +
                    " and o.createAt BETWEEN :start and :end " +
                    "ORDER BY o.createAt DESC"
    )
    List<Order> findOrdersByUserAndDateRange(@Param("userId") String userId,
                                             @Param("start") LocalDateTime start,
                                             @Param("end") LocalDateTime end);
}
