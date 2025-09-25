package com.example.managementapi.Specification;

import com.example.managementapi.Entity.Order;
import com.example.managementapi.Entity.Product;
import org.aspectj.weaver.ast.Or;
import org.springframework.data.jpa.domain.Specification;

public class OrderSpecification {
    //Filter: status,
    //Search: order code, ship address,
    //sort: creat at, complete at, order amount, quantity

    public static Specification<Order> filterByOrderStatus(String orderStatus){
        return ((root, query, criteriaBuilder) -> {
            if(orderStatus == null || orderStatus.isEmpty()){
                return criteriaBuilder.conjunction();
            }
            try{
                return criteriaBuilder.equal(root.get("orderStatus"), orderStatus);
            }catch (IllegalArgumentException e){
                return criteriaBuilder.conjunction();
            }
        });
    }

    public static Specification<Order> hasKeyword(String keyword){
        return (root, query, criteriaBuilder) -> {
            if(keyword == null || keyword.isEmpty()){
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.or(criteriaBuilder.like(criteriaBuilder.lower(root.get("orderCode")), "%" + keyword.toLowerCase() + "%"),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("shipAddress")), "%" + keyword.toLowerCase() + "%"));
        };
    }

    public static Specification<Order> searchOrder(String keyword, String orderStatus){
        return Specification.allOf(filterByOrderStatus(orderStatus),
                hasKeyword(keyword));
    }
}
