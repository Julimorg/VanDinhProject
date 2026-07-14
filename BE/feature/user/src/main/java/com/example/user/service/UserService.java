package com.example.user.service;

import com.example.common.dto.user.request.CreateUserReq;
import com.example.common.dto.user.request.UpdateMyProfileReq;
import com.example.common.dto.user.request.UpdateUserByAdminReq;
import com.example.common.dto.user.response.*;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.service.CloudinaryService;
import com.example.common.service.FileUploadService;
import com.example.persistence.entity.Role;
import com.example.persistence.entity.User;
import com.example.persistence.enumTable.Status;
import com.example.user.config.UserSpecification;
import com.example.user.domain.mapper.UserMapper;
import com.example.user.repository.RoleRepository;
import com.example.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    private final FileUploadService  fileUploadService;

    private final UserMapper userMapper;

    private User findUserOrThrow(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF', 'ROLE_USER')")
    public List<GetUserSelectionRes> getUserSelection(){
        return userRepository.findAllForSelection();
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
    public Page<GetUserRes> getUsersByAdmin(String keyword,
                                            String status,
                                            String role,
                                            Pageable pageable) {
        Specification<User> spec = UserSpecification
                .from(UserSpecification
                        .UserFilter
                        .forAdmin(keyword, status, role));
        return userRepository.findAll(spec, pageable).map(userMapper::toGetUser);
    }


    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_STAFF', 'ROLE_ADMIN')")
    public GetMyProfileDetailRes getMyProfile(String userId) {
        User user = userRepository.findByIdWithOrdersAndPayment(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toGetProfileDetailRes(user);
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF', 'ROLE_ADMIN')")
    public GetUserProfileDetailByAdminRes getUserProfileByAdmin(String userId) {
        User user = userRepository.findByIdWithRoles(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toGetUserProfileDetailByAdminRes(user);
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public CreateUserRes createUser(CreateUserReq req) {

        if (userRepository.existsByUserName(req.getUserName())) {

            throw new AppException(ErrorCode.USER_EXISTED);
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        Role role = roleRepository.findByName(req.getRoles())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        User user = userMapper.toCreateUser(req);

        user.setPassword(passwordEncoder.encode(req.getPassword()));

        user.setUserImg(fileUploadService.uploadImageIfPresent(req.getUserImg(), req.getUserName()));

        user.setRoles(Set.of(role));

        user.setStatus(Status.ACTIVE);

        return userMapper.toCreateUserRes(userRepository.save(user));
    }

    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN', 'ROLE_STAFF')")
    public UpdateMyProfileRes updateMyProfile(String userId, UpdateMyProfileReq request) {
        User user = findUserOrThrow(userId);

        // FIX: monolith dùng existsByUserName(request.getEmail()) — sai method
        if (!user.getEmail().equals(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        String newImgUrl = fileUploadService.uploadImageIfPresent(request.getUserImg(), request.getUserName());
        if (newImgUrl != null) user.setUserImg(newImgUrl);

        userMapper.toUpdateMyProfile(user, request);
        return userMapper.toUpdateMyProfileRes(userRepository.save(user));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public UpdateUserByAdminRes updateUserByAdmin(String userId, UpdateUserByAdminReq request) {
        User user = findUserOrThrow(userId);

        // Check trùng username — chỉ check nếu username thực sự thay đổi
        if (!user.getUserName().equals(request.getUserName())
                && userRepository.existsByUserName(request.getUserName())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        // Check trùng email — chỉ check nếu email thực sự thay đổi
        if (!user.getEmail().equals(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        String newImgUrl = fileUploadService.uploadImageIfPresent(request.getUserImg(), request.getUserName());
        if (newImgUrl != null) user.setUserImg(newImgUrl);

        userMapper.toUpdateUserByAdmin(user, request);

        return userMapper.toUpdateUseByAdminRes(userRepository.save(user));
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void deleteUser(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        userRepository.deleteById(userId);
    }



}
