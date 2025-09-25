package com.example.managementapi.Repository;

import com.example.managementapi.Dto.Response.Product.SearchProductRes;
import com.example.managementapi.Entity.Product;
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

    List<Product> findByProductQuantityLessThan(int quantity);

    //List<Product> searchProduct(String product);
//    @Query("SELECT p.productId AS productId, p.productName AS productName " +
//            "FROM Product p WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) ")
//    Page<SearchProductRes> searchProducts(String keyword, Pageable pageable);


}
