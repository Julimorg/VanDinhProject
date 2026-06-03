package com.example.diary.config;

import com.example.persistence.entity.UserDiary;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.example.persistence.enumTable.DiaryStatus;
import com.example.persistence.enumTable.PurchaseOrderStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import static javax.management.Query.and;

public class DiarySpecification {

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private DiarySpecification() {}

    public record DiaryFilter(
            String userId,
            String keyword,
            String status,
            String fromDate,
            String toDate
    ) {
        public static DiaryFilter of(String userId, String keyword, String status, String fromDate, String toDate) {
            return new DiaryFilter(userId, keyword, status, fromDate, toDate);
        }
    }

    private static Specification<UserDiary> noOp() {
        return (root, query, cb) -> cb.conjunction();
    }

    public static Specification<UserDiary> from(DiaryFilter filter) {
        return hasUserId(filter.userId())
                .and(hasKeyword(filter.keyword()))
                .and(hasFilterStatus(filter.status()))
                .and(hasDateBetween(filter.fromDate(), filter.toDate()));
    }

    private static Specification<UserDiary> hasUserId(String userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }

    private static Specification<UserDiary> hasFilterStatus(String status){
        if ( status == null ) return noOp();

        return (root, query, cb) ->
                cb.equal(root.get("diaryStatus"), DiaryStatus.valueOf(status));

    }

    private static Specification<UserDiary> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(keyword)) return cb.conjunction();
            String pattern = "%" + keyword.toLowerCase() + "%";
            return cb.like(cb.lower(root.get("diaryName")), pattern);
        };
    }

    private static Specification<UserDiary> hasDateBetween(String from, String to) {
        if (from == null && to == null) return noOp();

        LocalDate fromDate = (from != null) ? LocalDate.parse(from, FORMATTER) : null;
        LocalDate toDate   = (to != null)   ? LocalDate.parse(to, FORMATTER)   : null;

        return (root, query, cb) -> {

            // endDate null = phiếu đang mở → coi như vô tận
            // điều kiện: phiếu bắt đầu trước toDate VÀ phiếu kết thúc sau fromDate

            Predicate startBeforeTo = (toDate != null)
                    ? cb.lessThanOrEqualTo(root.get("startDate"), toDate)
                    : cb.conjunction();

            Predicate endAfterFrom = (fromDate != null)
                    ? cb.or(
                    root.get("endDate").isNull(),
                    cb.greaterThanOrEqualTo(root.get("endDate"), fromDate)
            )
                    : cb.conjunction();

            return cb.and(startBeforeTo, endAfterFrom);
        };
    }
}