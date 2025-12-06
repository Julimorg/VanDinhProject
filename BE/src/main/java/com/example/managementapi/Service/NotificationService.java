package com.example.managementapi.Service;


import com.example.managementapi.Dto.Response.Notification.NotificationRes;
import com.example.managementapi.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository; // nếu bạn cần lấy username

    // Gửi thông báo riêng cho 1 user (dùng userId làm principal name)
    public void sendToUser(String userId, NotificationRes notification) {
        messagingTemplate.convertAndSendToUser(
                userId,                              // Spring sẽ tự thêm prefix /user/
                "/queue/notifications",              // → client nhận ở /user/{userId}/queue/notifications
                notification
        );
    }

    // Gửi broadcast cho tất cả user đang online
    public void sendToAll(NotificationRes notification) {
        messagingTemplate.convertAndSend("/topic/public-notifications", notification);
    }

    // Gửi chỉ cho admin (nếu cần)
    public void sendToAdmins(NotificationRes notification) {
        messagingTemplate.convertAndSend("/topic/admin-broadcast", notification);
    }
}
