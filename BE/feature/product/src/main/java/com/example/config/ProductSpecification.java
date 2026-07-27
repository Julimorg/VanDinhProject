package com.example.config;

import com.example.persistence.entity.Product;
import jakarta.persistence.criteria.Predicate;
import org.apache.poi.util.StringUtil;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class ProductSpecification {

    private ProductSpecification() {}

    public record ProductFilter(
            String keyword,
            String categoryName,
            String supplierName,
            String productType,
            Double minPrice,
            Double maxPrice
    ) {
        /** Admin / staff: search full */
        public static ProductFilter full(String keyword,
                                         String categoryName,
                                         String supplierName,
                                         String productType,
                                         Double minPrice,
                                         Double maxPrice) {
            return new ProductFilter(keyword, categoryName, supplierName, productType, minPrice, maxPrice);
        }

        /** Chỉ search theo keyword — dùng cho quick-search bar */
        public static ProductFilter keywordOnly(String keyword) {
            return new ProductFilter(keyword, null, null, null,null, null);
        }

        /** Chỉ filter theo danh mục + nhà cung cấp + giá — không có keyword */
        public static ProductFilter filterOnly(String categoryName,
                                               String supplierName,
                                               String productType,
                                               Double minPrice,
                                               Double maxPrice) {
            return new ProductFilter(null, categoryName, supplierName,productType, minPrice, maxPrice);
        }
    }


    public static Specification<Product> from(ProductFilter filter) {
        return (root, query, cb) -> {
            if (query != null) query.distinct(true);
            return hasKeyword(filter.keyword())
                    .and(hasCategory(filter.categoryName()))
                    .and(hasSupplier(filter.supplierName()))
                    .and(hasPrice(filter.minPrice(), filter.maxPrice()))
                    .toPredicate(root, query, cb);
        };
    }


    private static Specification<Product> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(keyword)) return cb.conjunction();

            String pattern = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("productName")), pattern),
                    cb.like(cb.lower(root.get("productCode")), pattern)
            );
        };
    }

    private static Specification<Product> hasCategory(String categoryName) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(categoryName)) return cb.conjunction();

            return cb.equal(
                    cb.lower(root.get("category").get("categoryName")),
                    categoryName.toLowerCase()
            );
        };
    }

    private static Specification<Product> hasSupplier(String supplierName) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(supplierName)) return cb.conjunction();

            return cb.equal(
                    cb.lower(root.get("supplier").get("supplierName")),
                    supplierName.toLowerCase()
            );
        };
    }

    private static Specification<Product> hasProductType(String productType){
        return (root, query, cb) -> {
            if ( !StringUtils.hasText(productType)) return cb.conjunction();

            return cb.equal(
                    cb.lower(root.get("product").get("productType")),
                    productType.toLowerCase()
            );
        };
    }

    /**
     * Lọc theo khoảng giá — hỗ trợ cả 2 đầu, 1 đầu, hoặc bỏ qua.
     */
    private static Specification<Product> hasPrice(Double minPrice, Double maxPrice) {
        return (root, query, cb) -> {
            if (minPrice == null && maxPrice == null) return cb.conjunction();

            List<Predicate> predicates = new ArrayList<>();

            if (minPrice != null)
                predicates.add(cb.greaterThanOrEqualTo(root.get("productPrice"), minPrice));

            if (maxPrice != null)
                predicates.add(cb.lessThanOrEqualTo(root.get("productPrice"), maxPrice));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

}
