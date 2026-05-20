package com.example.repository;
import com.example.persistence.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String>, JpaSpecificationExecutor<Product> {
    
    boolean existsByProductName(String productName);

    boolean existsByProductCode(String productCode);
    
    List<Product> findByProductQuantityLessThan(int quantity);

    Product findByProductId(String productId);

    List<Product> findTop10ByOrderByCreateAtDesc();

    List<Product> findByCategoryCategoryId(String categoryId);

    List<Product> findBySupplierSupplierId(String supplierId);

}
