package com.example.user.repository;


import com.example.common.dto.user.response.GetUserSelectionRes;
import com.example.persistence.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {

    @Override
    @EntityGraph(attributePaths = {"cart", "forgotPassword"})
    Page<User> findAll(Specification<User> spec, Pageable pageable);

    Optional<User> findByUserName(String userName);

    Boolean existsByUserName(String username);

    Boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    List<User> findDistinctByRoles_NameIn(List<String> roles);

    Optional<User> findUsersById(String userId);

    @Query("""
            select new com.example.common.dto.user.response.GetUserSelectionRes(
                u.id, u.userName, u.firstName, u.lastName
            )
            from User u
            order by u.userName
            """)
    List<GetUserSelectionRes> findAllForSelection();

    @Query("select u from User u left join fetch u.roles where u.id = :userId")
    Optional<User> findByIdWithRoles(@Param("userId") String userId);

    @Query("select distinct u from User u left join fetch u.orders o left join fetch o.payment where u.id = :userId")
    Optional<User> findByIdWithOrdersAndPayment(@Param("userId") String userId);
}
