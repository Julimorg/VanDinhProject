package com.example.managementapi.Repository;

import com.example.managementapi.Entity.UserNotifications;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface UserNotificationsRepository extends JpaRepository<UserNotifications, String> {

    Optional<UserNotifications> findByUserId(String userId);

    List<UserNotifications> findAllByUserId(String userId);


    List<UserNotifications> findTop5ByUserIdOrderByDeliveredAtDesc(String userId);
}
