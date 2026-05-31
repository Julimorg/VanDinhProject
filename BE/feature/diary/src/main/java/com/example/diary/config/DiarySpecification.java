package com.example.diary.config;

import com.example.persistence.entity.UserDiary;
import java.time.LocalDate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class DiarySpecification {

    private DiarySpecification() {}

    public record DiaryFilter(
        String keyword,
        LocalDate fromDate,
        LocalDate toDate
    ) {
        public static DiaryFilter of(
            String keyword,
            LocalDate fromDate,
            LocalDate toDate
        ) {
            return new DiaryFilter(keyword, fromDate, toDate);
        }
    }

    public static Specification<UserDiary> from(DiaryFilter filter) {
        return (root, query, cb) -> {
            if (query != null) query.distinct(true);
            return hasKeyword(filter.keyword())
                .and(fromDate(filter.fromDate()))
                .and(toDate(filter.toDate()))
                .toPredicate(root, query, cb);
        };
    }

    private static Specification<UserDiary> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(keyword)) return cb.conjunction();
            String pattern = "%" + keyword.toLowerCase() + "%";
            return cb.like(cb.lower(root.get("createdBy")), pattern);
        };
    }

    private static Specification<UserDiary> fromDate(LocalDate fromDate) {
        return (root, query, cb) -> {
            if (fromDate == null) return cb.conjunction();
            return cb.greaterThanOrEqualTo(root.get("diaryDate"), fromDate);
        };
    }

    private static Specification<UserDiary> toDate(LocalDate toDate) {
        return (root, query, cb) -> {
            if (toDate == null) return cb.conjunction();
            return cb.lessThanOrEqualTo(root.get("diaryDate"), toDate);
        };
    }
}
