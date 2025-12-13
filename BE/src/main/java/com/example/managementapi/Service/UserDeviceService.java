package com.example.managementapi.Service;

import com.example.managementapi.Entity.UserDevice;
import com.example.managementapi.Repository.UserDeviceRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
@Slf4j
public class UserDeviceService {
    private final UserDeviceRepository userDeviceRepository;

    public void saveUserSocketId(String userId, String sessionId){
        UserDevice userDevice = UserDevice.builder()
                .userId(userId)
                .socketId(sessionId)
                .lastSeen(LocalDateTime.now())
                .build();

        userDeviceRepository.save(userDevice);
    }

    public void removeUserSocketId(String sessionId) {
        // Tìm và xóa bản ghi UserDevice dựa trên socketId (sessionId)
        userDeviceRepository.deleteBySocketId(sessionId);
    }
}
