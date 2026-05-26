package com.example.repository;

import com.example.persistence.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, String>, JpaSpecificationExecutor<PurchaseOrder> {
    @EntityGraph(attributePaths = "items")
    Optional<PurchaseOrder> findWithItemsByPurchaseOrderId(String purchaseOrderId);
}
