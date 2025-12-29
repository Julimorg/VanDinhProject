package com.example.managementapi.Service;

import com.example.managementapi.Dto.Response.Notification.NotificationRes;
import com.example.managementapi.Entity.*;
import com.example.managementapi.Enum.UserNotifactionSendChannel;
import com.example.managementapi.Enum.UserNotifactionStatus;
import com.example.managementapi.Repository.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class SchedulerService {

    private final ProductRepository productRepository;

    private EmailService emailService;

    private final SimpMessagingTemplate messagingTemplate;

    private final NotificationsRepository notificationsRepository;

    private final UserDeviceRepository deviceRepo;

    private final UserNotificationsRepository userNotificationsRepository;

    private final UserRepository userRepository;


    @Scheduled(fixedRate = 3600000) // --> 1h check 1 lần
    public void checkLowQuantiyProduct(){

        List<Product> checkProductQuantity =  productRepository.findByProductQuantityLessThan(10);

        List<User> admins = userRepository.findDistinctByRoles_NameIn(
                List.of("ADMIN", "STAFF")
        );

        LocalDateTime now = LocalDateTime.now();

        System.out.println("Is Running: " + now);

        for(Product product : checkProductQuantity){

            List<UserNotifications> savedUserNotis = new ArrayList<>();

            if (product.getLastNotified() == null ||
                    product.getLastNotified().isBefore(now.minusHours(24)))
            {
                try {
                    System.out.println("Is Sending Email : " + now);

                    emailService.sendLowStockEmail("kienphongtran2003@gmail.com", product);

                    Notifications noti = notificationsRepository.save(Notifications.builder()
                            .title("Product: " + product.getProductName() + "is now at low stock!")
                            .message("Product: "
                                    + product.getProductName()
                                    + " now is " + product.getProductQuantity()
                                    + ", you need to fill it !"
                            )
                            .type("Low Stock!")
                            .createBy("System")
                            .build());

                    for( User admin : admins) {

                        Optional<UserDevice> deviceOpt = deviceRepo.findFirstByUserIdAndSocketIdIsNotNull(admin.getId());

                        if (deviceOpt.isEmpty()) continue;


                        UserNotifications un = UserNotifications.builder()
                                .notifications(noti)
                                .userId(admin.getId())
                                .isRead(false)
                                .status(UserNotifactionStatus.PENDING)
                                .sendChannel(UserNotifactionSendChannel.WEB)
                                .build();

                        try{
                            String sessionId = deviceOpt.get().getSocketId();

                            NotificationRes payload = NotificationRes.builder()
                                    .notificationId(noti.getNotificationId())
                                    .title(noti.getTitle())
                                    .message(noti.getMessage())
                                    .type(noti.getType())
                                    .createdAt(noti.getCreatedAt())
                                    .build();

                            String personalQueue = "/queue/notifications-user" + sessionId;
                            messagingTemplate.convertAndSend(personalQueue, payload);

                            log.info(" Đã gửi realtime notification đến user [{}]", admin.getId());

                        } catch (RuntimeException e) {
                            throw new RuntimeException("There is something wrong!");
                        }

                        savedUserNotis.add(un);

                    }

                    userNotificationsRepository.saveAll(savedUserNotis);

                    product.setLastNotified(now);

                    productRepository.save(product);

                } catch (Exception e) {
                    log.error("Lỗi khi xử lý product {}", product.getProductId(), e);

                }
            }
        }
    }


}
