package com.example.managementapi.Repository;

import com.example.managementapi.Entity.UserNotifications;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface UserNotificationsRepository extends JpaRepository<UserNotifications, String> {

    Optional<UserNotifications> findByUserId(String userId);

    List<UserNotifications> findAllByUserId(String userId);
}
