package com.example.diary.config;

import com.example.persistence.entity.UserDiary;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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
            String fromDate,
            String toDate
    ) {
        public static DiaryFilter of(String userId, String keyword, String fromDate, String toDate) {
            return new DiaryFilter(userId, keyword, fromDate, toDate);
        }
    }

    private static Specification<UserDiary> noOp() {
        return (root, query, cb) -> cb.conjunction();
    }

    public static Specification<UserDiary> from(DiaryFilter filter) {
        return hasUserId(filter.userId())
                .and(hasKeyword(filter.keyword()))
                .and(hasDateBetween(filter.fromDate(), filter.toDate()));
    }

    private static Specification<UserDiary> hasUserId(String userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
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
        LocalDate toDate   = (to   != null) ? LocalDate.parse(to,   FORMATTER) : null;

        if (fromDate == null)
            return (root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("diaryDate"), toDate);
        if (toDate == null)
            return (root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("diaryDate"), fromDate);

        return (root, query, cb) ->
                cb.between(root.get("diaryDate"), fromDate, toDate);
    }
}