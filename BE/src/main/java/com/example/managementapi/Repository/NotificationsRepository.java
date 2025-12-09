package com.example.managementapi.Repository;

import com.example.managementapi.Entity.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;


public interface NotificationsRepository extends JpaRepository<Notifications, String> {
}
