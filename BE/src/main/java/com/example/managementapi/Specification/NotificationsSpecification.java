package com.example.managementapi.Specification;

import com.example.managementapi.Entity.Category;
import com.example.managementapi.Entity.Notifications;
import org.springframework.data.jpa.domain.Specification;

public class NotificationsSpecification {
//    public static Specification<Notifications> filter(String keyword){
//        return (root, query, criteriaBuilder) -> {
//            if(keyword == null || keyword.isEmpty()){
//                return criteriaBuilder.conjunction();
//            }
//            return criteriaBuilder.or(criteriaBuilder.like(criteriaBuilder.lower(root.get("categoryName")), "%" + keyword.toLowerCase() + "%"));
//        };
//    }

}