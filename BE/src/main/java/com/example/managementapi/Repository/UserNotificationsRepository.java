package com.example.managementapi.Repository;

import com.example.managementapi.Entity.UserNotifications;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserNotificationsRepository extends JpaRepository<UserNotifications, String> {
}
