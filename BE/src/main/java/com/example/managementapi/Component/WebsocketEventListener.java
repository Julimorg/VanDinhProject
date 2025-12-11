//package com.example.managementapi.Component;
//
//import com.example.managementapi.Entity.UserDevice;
//import com.example.managementapi.Repository.UserDeviceRepository;
//import com.example.managementapi.Service.JwtService;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.context.event.EventListener;
//import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.messaging.SessionConnectedEvent;
//import org.springframework.web.socket.messaging.SessionDisconnectEvent;
//
//import java.time.LocalDateTime;
//
//
//@Slf4j
//@Component
//@RequiredArgsConstructor
//public class WebsocketEventListener {
//
//    private final UserDeviceRepository deviceRepo;
//
//    private final JwtService jwtService;
//
//
//    //* HANDSHAKE CATCH USER VIỆC MỞ WEB ĐỂ CONNECT VÀO WEBSOCKET
//    @EventListener
//    public void handleWebSocketConnect(SessionConnectedEvent event) {
//
//        //? Lấy info connect từ browser send lên
//        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
//
//        //? Lấy header từ Auth
//        String authHeader = accessor.getFirstNativeHeader("Authorization");
//
//        log.warn("AuthHeader: " + authHeader);
//
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            log.warn("User Connected but dont have Token → Not Allowed!");
//            return;
//        }
//
//        //? Cut từ Bearer đi để lấy Token
//        String token = authHeader.substring(7);
//
//        String userId = jwtService.extractUserId(token);
//
//        //? Mỗi lần kết nối WebSocket, Spring tạo 1 cái "mã riêng" gọi là sessionId
//        //? Ví dụ: "websocket_abc12345" → giống như phát cho khách 1 cái thẻ số bàn
//        String sessionId = accessor.getSessionId();
//
//        //? Check DB xem User Online chưa
//        //? Nếu chưa thì tạo mới
//        UserDevice device = deviceRepo.findByUserId(userId)
//                .orElseGet(UserDevice::new);
//
//        device.setUserId(userId);
//        device.setSocketId(sessionId);
//        device.setLastSeen(LocalDateTime.now());
//
//        deviceRepo.save(device);
//
//        log.info("User {} vừa MỞ WEB → ĐANG ONLINE với socketId = {}", userId, sessionId);
//
//    }
//
//    @EventListener
//    public void handleWebSocketDisconnect(SessionDisconnectEvent event) {
//
//        //? Lấy sessionId khi User Disconnect
//        String sessionId = event.getSessionId();
//
//        deviceRepo.findAll().stream()
//                .filter(d -> sessionId.equals(d.getSocketId()))
//                .forEach(d -> {
//
//                    //? set socketId trong DB là null để mark user đó là Offline
//                    d.setSocketId(null);
//                    deviceRepo.save(d);
//                    log.info("User {} vừa TẮT TAB → OFFLINE", d.getUserId());
//                });
//    }
//}
