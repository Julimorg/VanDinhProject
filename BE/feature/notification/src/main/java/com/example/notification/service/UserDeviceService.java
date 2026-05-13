package com.example.notification.service;

import com.example.common.interfaces.user.UserPresenceInternalService;
import com.example.messaging.events.UserOnlineStatusChangeEvent;
import com.example.notification.repository.UserDeviceRepository;
import com.example.persistence.entity.UserDevice;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserDeviceService implements UserPresenceInternalService {

    private final UserDeviceRepository userDeviceRepository;

    private final ApplicationEventPublisher  eventPublisher;

    private void publishStatusEvent(String userId, UserDevice device) {
        try {
            eventPublisher.publishEvent(
                    new UserOnlineStatusChangeEvent(this, userId, device.getSocketId() != null)
            );
            log.info(" Published UserOnlineStatusChangeEvent for user [{}]", userId);
        } catch (Exception e) {

            log.error("Failed to publish status event for user [{}]: {}", userId, e.getMessage(), e);
        }
    }


    @Override
    public void markOnline(String userId, String sessionId) {
        UserDevice device = userDeviceRepository.findByUserId(userId)
                .orElseGet(UserDevice::new);

        device.setUserId(userId);
        device.setSocketId(sessionId);
        device.setLastSeen(LocalDateTime.now());
        userDeviceRepository.save(device);

        publishStatusEvent(userId, device);
    }

    @Override
    public void markOffline(String userId, String sessionId) {

        userDeviceRepository.findByUserId(userId).ifPresent(device -> {
            device.setSocketId(null);
            device.setLastSeen(LocalDateTime.now());
            userDeviceRepository.save(device);

            publishStatusEvent(userId, device);
        });
    }

    @Override
    public boolean isOnline(String userId) {
        return userDeviceRepository
                .findFirstByUserIdAndSocketIdIsNotNull(userId).isPresent();
    }

    @Override
    public Optional<String> getSocketId(String userId) {
        return userDeviceRepository.findFirstByUserIdAndSocketIdIsNotNull(userId)
                .map(UserDevice::getSocketId);
    }
}
