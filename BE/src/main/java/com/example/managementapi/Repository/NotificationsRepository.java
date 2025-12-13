package com.example.managementapi.Repository;

import com.example.managementapi.Entity.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface NotificationsRepository extends JpaRepository<Notifications, String> {

}
