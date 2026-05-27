package com.example.config;

import com.example.persistence.entity.PurchaseOrder;
import com.example.persistence.enumTable.PurchaseOrderStatus;
import lombok.experimental.UtilityClass;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@UtilityClass
public class InventorySpecification {

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    /**
    *
    *  @param keyword -> search theo supplierName / poCode (LN-23032003)
    *  @param status -> filter theo status
     * @param orderDateFrom -> Date bat dau
     * @param orderDateTo -> Date ket thuc
     *
    * */
    public record PurchaseOrderFilter(
            String keyword,
            String status,
            String orderDateFrom,
            String orderDateTo
    ) {
        public static PurchaseOrderFilter forSearchSortFilter(String keyword,
                                                              String status,
                                                              String orderDateFrom,
                                                              String orderDateTo) {
            return new PurchaseOrderFilter(keyword, status, orderDateFrom, orderDateTo);
        }
    }

    private String likePattern(String keyword) {
        return "%" + keyword.toLowerCase() + "%";
    }

    private <T> Specification<T> noOp() {
        return (root, query, cb) -> cb.conjunction();
    }

    public Specification<PurchaseOrder> from(PurchaseOrderFilter f) {
        return hasKeyword(f.keyword())
                .and(hasStatus(f.status()))
                .and(hasOrderDateBetween(f.orderDateFrom(), f.orderDateTo()));

    }

    //* SEARCH Keyword
    private Specification<PurchaseOrder> hasKeyword(String keyword) {
        if (!StringUtils.hasText(keyword)) return noOp();

        String pattern = likePattern(keyword);
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("poCode")),       pattern),
                cb.like(cb.lower(root.get("supplierName")), pattern)
        );
    }

    //* FILTER Status
    private Specification<PurchaseOrder> hasStatus(String status) {
        if (!StringUtils.hasText(status)) return noOp();

        return (root, query, cb) ->
                cb.equal(root.get("status"), PurchaseOrderStatus.valueOf(status));
    }

    //* FILTER Date
    private Specification<PurchaseOrder> hasOrderDateBetween(String from, String to) {
        if (from == null && to == null) return noOp();

        LocalDateTime fromDate = (from != null) ? LocalDateTime.parse(from, FORMATTER) : null;
        LocalDateTime toDate   = (to   != null) ? LocalDateTime.parse(to,   FORMATTER) : null;

        if (fromDate == null)
            return (root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("orderDate"), toDate);
        if (toDate == null)
            return (root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("orderDate"), fromDate);

        return (root, query, cb) ->
                cb.between(root.get("orderDate"), fromDate, toDate);
    }

}

