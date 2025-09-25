package com.example.managementapi.Repository;


import com.example.managementapi.Entity.Order;
import com.example.managementapi.Entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, String> {


}
