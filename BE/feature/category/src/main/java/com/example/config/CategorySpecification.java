package com.example.config;

import com.example.persistence.entity.Category;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class CategorySpecification {

    private CategorySpecification() {};

    public record CategoryFilter(String keyword){

        public static CategoryFilter keywordOnly(String keyword){
            return new CategoryFilter(keyword);
        }
    }

    private static Specification<Category> hasKeyword(String keyword){
        return(root, query, cb) -> {
            if ( !StringUtils.isEmpty(keyword) ) {
                return cb.conjunction();
            }

            String pattern = "%" + keyword.toLowerCase() + "%";

            return cb.like(
                    cb.lower(root.get("categoryName")), pattern);
        };
    }

    public static Specification<Category> from(CategoryFilter filter){
        return hasKeyword(filter.keyword());
    }
}
