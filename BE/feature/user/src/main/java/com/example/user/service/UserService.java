package com.example.user.service;

import com.example.common.dto.user.request.CreateUserReq;
import com.example.common.dto.user.response.CreateUserRes;
import com.example.common.dto.user.response.GetMyProfileDetailRes;
import com.example.common.dto.user.response.GetUserProfileRes;
import com.example.common.enums.ErrorCode;
import com.example.common.enums.Status;
import com.example.common.exception.AppException;
import com.example.common.service.CloudinaryService;
import com.example.common.service.FileUploadService;
import com.example.persistence.entity.Role;
import com.example.persistence.entity.User;
import com.example.user.config.UserSpecification;
import com.example.user.domain.mapper.UserMapper;
import com.example.user.repository.RoleRepository;
import com.example.user.repository.UserRepository;
import com.example.common.dto.user.response.GetUserRes;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    public GetMyProfileDetailRes getProfileDetail(String userId) {
        User user = findUserOrThrow(userId);
        return userMapper.toGetProfileDetailRes(user);
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


}
