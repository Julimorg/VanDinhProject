package com.example.config;

import com.example.persistence.entity.Color;
import com.example.persistence.entity.User;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class ColorSpecification {

    private ColorSpecification() {};

    public record ColorFilter(String keyword, String supplierName){
        public static  ColorFilter keywordAndSupplier(String keyword, String supplierName){
            return new ColorFilter(keyword, supplierName);
        }
    }

    private static Specification<Color> hasKeyword(String keyword){
        return ( root, query, cb) -> {
            if (!StringUtils.hasText(keyword)) {
                return cb.conjunction();
            }

            String pattern = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("ColorName")),
                            cb.lower(root.get("ColorCode"))
            ));
        };
    }

    private static Specification<Color> hasSupplier(String supplierName){
        return (root, query, cb) -> {
            if (!StringUtils.hasText(supplierName)) {
                return cb.conjunction();
            }

            return cb.like(
                    cb.lower(root.get("supplierName")),
                    "%" + supplierName.toLowerCase() + "%"
            );
        };
    }

    public static Specification<Color> from(ColorFilter filter) {
        return hasSupplier(filter.keyword())
                .and(hasSupplier(filter.supplierName()));
    }


}
