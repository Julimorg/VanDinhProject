package com.example.managementapi.Specification;

import com.example.managementapi.Entity.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {
    public static Specification<Product> filterByCategory(String categoryName){
        return (root, query, criteriaBuilder) -> {
            if(categoryName == null || categoryName.isEmpty()){
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(criteriaBuilder.lower(root.get("category").get("categoryName")), categoryName.toLowerCase());
        };
    }

    public static Specification<Product> filterBySupplier(String supplierName){
        return (root, query, criteriaBuilder) -> {
            if(supplierName == null || supplierName.isEmpty()){
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(criteriaBuilder.lower(root.get("suppliers").get("supplierName")), supplierName.toLowerCase());
        };
    }

    public static Specification<Product> hasKeyword(String keyword){
        return (root, query, criteriaBuilder) -> {
            if(keyword == null || keyword.isEmpty()){
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.or(criteriaBuilder.like(criteriaBuilder.lower(root.get("productName")), "%" + keyword.toLowerCase() + "%"),
                                      criteriaBuilder.like(criteriaBuilder.lower(root.get("productCode")), "%" + keyword.toLowerCase() + "%"));
        };
    }

    public static Specification<Product> searchProduct(String keyword, String categoryName, String supplierName){
        return Specification.allOf(filterByCategory(categoryName),
                                   filterBySupplier(supplierName),
                                   hasKeyword(keyword));

    }
}
