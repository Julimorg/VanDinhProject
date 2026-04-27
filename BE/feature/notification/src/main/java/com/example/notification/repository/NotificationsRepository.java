package com.example.notification.repository;
import com.example.persistence.entity.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface NotificationsRepository extends JpaRepository<Notifications, String> {

}
