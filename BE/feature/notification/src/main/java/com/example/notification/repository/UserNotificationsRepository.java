package com.example.notification.repository;
import com.example.persistence.entity.UserNotifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface UserNotificationsRepository extends JpaRepository<UserNotifications, String>, JpaSpecificationExecutor<UserNotifications> {

    Optional<UserNotifications> findByUserId(String userId);

    Page<UserNotifications> findAllByUserIdAndIsRead(String userId, Boolean isRead,  Pageable pageable);

    List<UserNotifications> findTop5ByUserIdOrderByDeliveredAtDesc(String userId);

    int countByUserIdAndIsReadFalse(String userId);

    Page<UserNotifications> findAllByUserId(String userId, Pageable pageable);

}
