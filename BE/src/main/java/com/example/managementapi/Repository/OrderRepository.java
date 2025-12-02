package com.example.managementapi.Repository;


import com.example.managementapi.Entity.Cart;
import com.example.managementapi.Entity.Order;
import com.example.managementapi.Entity.User;
import com.example.managementapi.Enum.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String>, JpaSpecificationExecutor<Order> {

    Page<Order> findAllByUserId(String userId, Pageable pageable);

    Optional<Order> findByUserId(String userId);

    Page<Order> findByUser(User user, Pageable pageable);

    Optional<Order> findByUserAndOrderId(User user, String orderId);
}
