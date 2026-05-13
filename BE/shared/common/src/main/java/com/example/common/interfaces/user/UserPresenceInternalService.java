package com.example.common.interfaces.user;

import java.util.Optional;

public interface UserPresenceInternalService {

    void markOnline(String userId, String sessionId);

    void markOffline(String userId, String sessionId);

    boolean isOnline(String userId);

    Optional<String> getSocketId(String userId);


}
