package com.example.common.interfaces.user;
import com.example.persistence.entity.User;

public interface UserInternalService {

    void validateUserExists(String userId);

    User getUserById(String userId);
}
