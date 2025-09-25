package com.example.managementapi.Specification;

import com.example.managementapi.Entity.User;
import org.springframework.data.jpa.domain.Specification;

public class UserByUserSpecification {

    //? Khai báo kiểu Specification để query key "keyword"
    public static Specification<User> hasKeyword(String keyword){

        //? root đại diện cho entity để truy cập các column
        //? query đại diện cho query -> Select, ...
        //? criteriaBuilder là 1 factory tạo các Condition ( WHERE, LIKE, OR, ... )
        return(root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.isEmpty()){
                return criteriaBuilder.conjunction();
            }

            //? Tạo điều kiện OR:
            //?         userName LIKE '%keyword%'
            //?         OR email LIKE '%keyword%'
            //?         OR phone Like '%keyword%'

            return criteriaBuilder.or(
                    //? Tìm kiếm không phân biệt hoa thường trên cột name
                    //? root.get("name"): Truy cập cột name (tương đương u.name trong SQL)
                    //? criteriaBuilder.lower: Chuyển name thành chữ thường
                    //? "%" + keyword.toLowerCase() + "%": Tìm chuỗi chứa keyword
                    criteriaBuilder
                            .like(criteriaBuilder
                                    .lower(root
                                            .get("userName")), "%" + keyword.toLowerCase() + "%"),
                    criteriaBuilder
                            .like(criteriaBuilder
                                    .lower(root
                                            .get("email")), "%" + keyword.toLowerCase() + "%"),
                    criteriaBuilder
                            .like(criteriaBuilder
                                    .lower(root
                                            .get("phone")), "%" + keyword.toLowerCase() + "%")
            );
        };
    }

    //? Filter User với Status
    public static Specification<User> userDobFilter(String userDob){
        return(root, query, criteriaBuilder) -> {
            if (userDob == null || userDob.isEmpty()){
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.or(
                    criteriaBuilder
                            .like(criteriaBuilder
                            .lower(root.get("userDob")), "%" + userDob.toLowerCase() + "%")
            );
        };
    }

    public static Specification<User> searchByUser(String keyword, String userDob){
        return (root, query, cb) -> {
            //? sử dụng distinct để tránh các record trùng lặp khi Join
            //? Tương đương SELECT DISTINCT trong SQL
            query.distinct(true);

            //? Kết hợp tất cả điều kiện bằng AND
            //? SQL tương ứng: WHERE (...) AND (...)
            return Specification.allOf(
                    hasKeyword(keyword),
                    userDobFilter(userDob)
            ).toPredicate(root, query, cb);
        };
    }
}
