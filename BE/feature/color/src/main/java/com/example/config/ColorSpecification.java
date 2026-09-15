package com.example.config;

import com.example.persistence.entity.Color;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class ColorSpecification {

    private ColorSpecification() {}

    public record ColorFilter(String keyword) {
        public static ColorFilter of(String keyword) {
            return new ColorFilter(keyword);
        }
    }

    private static Specification<Color> searchKeyword(String keyword) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(keyword)) {
                return cb.conjunction();
            }
            String pattern = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("colorName")), pattern),
                    cb.like(cb.lower(root.get("colorCode")), pattern)
            );
        };
    }

    public static Specification<Color> hasSupplierId(String supplierId) {
        return (root, query, cb) ->
                StringUtils.hasText(supplierId)
                        ? cb.equal(root.get("supplier").get("supplierId"), supplierId)
                        : cb.conjunction();
    }

    public static Specification<Color> from(ColorFilter filter) {
        return searchKeyword(filter.keyword());
    }
}