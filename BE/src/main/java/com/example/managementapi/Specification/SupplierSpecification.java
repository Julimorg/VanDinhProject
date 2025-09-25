package com.example.managementapi.Specification;

import com.example.managementapi.Entity.Supplier;
import org.springframework.data.jpa.domain.Specification;

public class SupplierSpecification {
    public static Specification<Supplier> hasKeyword(String keyword) {
        return(root, query, criteriaBuilder) -> {
            if(keyword == null || keyword.isEmpty()){
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.or(
                    criteriaBuilder
                            .like(criteriaBuilder
                                    .lower(root.get("supplierName")), "%" + keyword.toLowerCase() + "%"),
                    criteriaBuilder
                            .like(criteriaBuilder
                                    .lower(root.get("supplierPhone")), "%" + keyword.toLowerCase() + "%"),
                    criteriaBuilder
                            .like(criteriaBuilder
                                    .lower(root.get("supplierEmail")), "%" + keyword.toLowerCase() + "%")
            );
        };
    }

    public static Specification<Supplier> searchByCriteria(String keyword) {
        return(root,query,criteriaBuilder) -> {
            query.distinct(true);

            return Specification.allOf(hasKeyword(keyword)).toPredicate(root,query,criteriaBuilder);
        };
    }
}
