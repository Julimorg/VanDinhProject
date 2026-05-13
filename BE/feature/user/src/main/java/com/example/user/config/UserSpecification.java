package com.example.user.config;


import com.example.persistence.entity.User;
import com.example.persistence.enumTable.Status;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class UserSpecification {

    private UserSpecification() {};

    /**
     * @param keyword tìm theo userName / email / phone
     * @param status  lọc theo trạng thái (ACTIVE / INACTIVE)
     * @param role    lọc theo tên role (ADMIN / USER / STAFF)
     * @param dob     lọc theo ngày sinh (dùng cho user xem profile)
     *
     **/

    public record UserFilter (String keyword, String status, String role, String dob){

        public static UserFilter forAdmin(String keyword, String status, String role){
            return new UserFilter(keyword,status, role, null);
        }

        public static UserFilter forUser(String keyword, String dob) {
            return new UserFilter(keyword, null, null, dob);
        }

    }


    public static Specification<User> from(UserFilter filter) {
        return hasKeyword(filter.keyword())
                .and(hasStatus(filter.status()))
                .and(hasRole(filter.role()))
                .and(hasDob(filter.dob()));
    }

    // ----------------------------------------------------------------
    // Predicates — mỗi method là 1 điều kiện độc lập
    // ----------------------------------------------------------------

    private static Specification<User> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(keyword)) {
                return cb.conjunction();
            }

            String pattern = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("userName")), pattern),
                    cb.like(cb.lower(root.get("email")), pattern),
                    cb.like(cb.lower(root.get("phone")), pattern)
            );
        };
    }

    /**
     * Filter theo status (ACTIVE / INACTIVE).
     * So sánh exact thay vì LIKE — status là enum, không cần fuzzy search.
     */
    private static Specification<User> hasStatus(String status) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(status)) return cb.conjunction();

            // Cast string → enum để so sánh chính xác
            try {
                var statusEnum = Status.valueOf(status.toUpperCase());
                return cb.equal(root.get("status"), statusEnum);
            } catch (IllegalArgumentException e) {
                return cb.conjunction();
            }
        };
    }

    /**
     * Filter theo role — join bảng roles để query.
     * query.distinct(true) tránh duplicate khi JOIN.
     */
    private static Specification<User> hasRole(String role) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(role)) return cb.conjunction();

            // distinct tránh duplicate record khi JOIN nhiều roles
            if (query != null) query.distinct(true);

            // JOIN users → roles
            Join<Object, Object> rolesJoin = root.join("roles", JoinType.LEFT);

            return cb.like(cb.lower(rolesJoin.get("name")), "%" + role.toLowerCase() + "%");
        };
    }

    /**
     * Filter theo ngày sinh — chỉ dùng cho user tự tìm.
     */
    private static Specification<User> hasDob(String dob) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(dob)) return cb.conjunction();

            // dob là LocalDate, LIKE không hoạt động trực tiếp
            // Cast về string để tìm theo prefix (ví dụ: "1999" tìm tất cả sinh năm 1999)
            return cb.like(root.get("userDob").as(String.class), "%" + dob + "%");
        };
    }
}
