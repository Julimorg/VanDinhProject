package com.example.config;

import com.example.persistence.entity.Supplier;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class SupplierSpecification {
    private SupplierSpecification() {};


    /**
     * @param keyword tìm theo supplierName / supplierPhone / supplierEmail
     * @param status  lọc theo trạng thái (ACTIVE / INACTIVE)
     */
    public record SupplierFilter(String keyword, String status) {

        public static SupplierFilter of(String keyword, String status) {
            return new SupplierFilter(keyword, status);
        }

        public static SupplierFilter keywordOnly(String keyword) {
            return new SupplierFilter(keyword, null);
        }
    }

    public static Specification<Supplier> from(SupplierFilter filter) {
        return hasKeyword(filter.keyword());
    }

    public static Specification<Supplier> supported(SupplierFilter filter){
        return hasKeywordForSupplierSelection(filter.keyword);
    }

    /*
     * Filter theo keyword — tìm theo tên / số điện thoại / email.
     */
    private static Specification<Supplier> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(keyword)) return cb.conjunction();

            String pattern = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("supplierName")),  pattern),
                    cb.like(cb.lower(root.get("supplierPhone")), pattern),
                    cb.like(cb.lower(root.get("supplierEmail")), pattern)
            );
        };
    }

    private static Specification<Supplier> hasKeywordForSupplierSelection(String keyword){
        return (root, query, cb) -> {
            if (!StringUtils.hasText(keyword)) return cb.conjunction();
            String pattern = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("supplierName")),  pattern),
                    cb.like(cb.lower(root.get("supplierPhone")), pattern),
                    cb.like(cb.lower(root.get("supplierEmail")), pattern)
            );
        };
    }


}
