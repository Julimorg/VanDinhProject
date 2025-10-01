package com.example.managementapi.Specification;

import com.example.managementapi.Entity.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

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

    public static Specification<Product> filterByPrice(Double minPrice, Double maxPrice){
        return (root, query, criteriaBuilder) -> {
            if(minPrice == null && maxPrice == null){
                return  criteriaBuilder.conjunction();
            }

            List<Predicate> predicates = new ArrayList<>();

            if(minPrice != null){
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("productPrice"), minPrice));
            }

            if(maxPrice != null){
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("productPrice"), maxPrice));
            }

            return  criteriaBuilder.and(predicates.toArray(new Predicate[0]));

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

    public static Specification<Product> filterProduct(String categoryName, String supplierName, Double minPrice, Double maxPrice){
        return Specification.allOf(filterByCategory(categoryName),
                                   filterBySupplier(supplierName),
                                   filterByPrice(minPrice, maxPrice));
    }

    public static Specification<Product> searchProduct(String keyword, String categoryName, String supplierName){
        return Specification.allOf(filterByCategory(categoryName),
                                   filterBySupplier(supplierName),
                                   hasKeyword(keyword));

    }
}
