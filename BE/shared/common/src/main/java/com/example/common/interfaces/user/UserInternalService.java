package com.example.common.interfaces.user;
import com.example.persistence.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserInternalService {

    void validateUserExists(String userId);

    List<User> findAllByRoles_NameIn(List<String> roles);

    User getUserById(String userId);

    User findByUserName(String userName);

    User getUserNameById(String userId);

    Page<User> getAllUsers(Pageable pageable);
}
