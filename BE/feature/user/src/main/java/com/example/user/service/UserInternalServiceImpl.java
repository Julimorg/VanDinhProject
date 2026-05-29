package com.example.user.service;

import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.user.UserInternalService;
import com.example.persistence.entity.User;
import com.example.user.domain.mapper.UserMapper;
import com.example.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserInternalServiceImpl implements UserInternalService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    @Override
    public void validateUserExists(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
    }

    @Override
    public List<User> findAllByRoles_NameIn(List<String> roles) {
        return userRepository.findDistinctByRoles_NameIn(roles);
    }

    @Override
    public User getUserById(String userId) {

        validateUserExists(userId);
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return userMapper.toGetUserByIdWithInterface(user);
    }

    @Override
    public User findByUserName(String userName) {
        return userRepository
                .findByUserName(userName)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public User getUserNameById(String userId) {
        return userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }


}
