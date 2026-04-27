package com.example.config;

import com.example.persistence.entity.Order;
import com.example.persistence.enumTable.OrderStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class OrderSpecification {

    private OrderSpecification() {}


    /**
     * @param keyword     tìm theo orderCode / userName / shipAddress
     * @param orderStatus lọc theo trạng thái đơn hàng
     * @param userId      lọc theo user sở hữu order
     */
    public record OrderFilter(String keyword, String orderStatus, String userId) {

        /** Admin/Staff: search + filter toàn bộ */
        public static OrderFilter forAdmin(String keyword, String orderStatus) {
            return new OrderFilter(keyword, orderStatus, null);
        }

        /** User: chỉ xem orders của chính mình, filter theo status */
        public static OrderFilter forUser(String userId, String orderStatus) {
            return new OrderFilter(null, orderStatus, userId);
        }
    }


    public static Specification<Order> from(OrderFilter filter) {
        return (root, query, cb) -> {
            if (query != null) query.distinct(true);
            return hasKeyword(filter.keyword())
                    .and(hasOrderStatus(filter.orderStatus()))
                    .and(hasUserId(filter.userId()))
                    .toPredicate(root, query, cb);
        };
    }


    private static Specification<Order> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(keyword)) return cb.conjunction();

            String pattern = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("orderCode")), pattern),
                    cb.like(cb.lower(root.get("user").get("userName")), pattern),
                    cb.like(cb.lower(root.get("shipAddress")), pattern)
            );
        };
    }

    private static Specification<Order> hasOrderStatus(String orderStatus) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(orderStatus)) return cb.conjunction();

            try {
                OrderStatus status = OrderStatus.valueOf(orderStatus);
                return cb.equal(root.get("orderStatus"), status);
            } catch (IllegalArgumentException e) {
                return cb.conjunction();
            }
        };
    }

    private static Specification<Order> hasUserId(String userId) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(userId)) return cb.conjunction();
            return cb.equal(root.get("user").get("id"), userId);
        };
    }

}
