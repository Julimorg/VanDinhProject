package com.example.managementapi.Service;
import com.example.managementapi.Dto.Request.User.CreateUserReq;
import com.example.managementapi.Dto.Request.User.UpdateUseReq;
import com.example.managementapi.Dto.Request.User.UpdateUserByAdminReq;
import com.example.managementapi.Dto.Response.Cloudinary.CloudinaryRes;
import com.example.managementapi.Dto.Response.Supplier.GetSupplierSelectionRes;
import com.example.managementapi.Dto.Response.User.*;
import com.example.managementapi.Entity.Role;
import com.example.managementapi.Entity.User;
import com.example.managementapi.Enum.ErrorCode;
import com.example.managementapi.Enum.Status;
import com.example.managementapi.Enum.UserRole;
import com.example.managementapi.Exception.AppException;
import com.example.managementapi.Mapper.UserMapper;
import com.example.managementapi.Repository.RoleRepository;
import com.example.managementapi.Repository.UserRepository;
import com.example.managementapi.Specification.UserByAdminSpecification;
import com.example.managementapi.Specification.UserByUserSpecification;
import com.example.managementapi.Util.FileUpLoadUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    private final CloudinaryService cloudinaryService;

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF', 'ROLE_USER')")
    public List<GetUserSelectionRes> getUserSelection(){
        return userRepository.findAll()
                .stream()
                .map(user -> userMapper.toGetUserSelection(user))
                .toList();
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public Page<GetUserRes> getUser(String status, String keyword, Pageable pageable){
        Specification<User> spec = UserByAdminSpecification.searchUserByAdmin(keyword, status);
        return userRepository.findAll(spec, pageable)
                .map(user -> userMapper.toGetUser(user));

    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
    public Page<SearchByAdminRes> searchUserByAdmin(String keyword, String status, Pageable pageable){
        Specification<User> spec = UserByAdminSpecification.searchUserByAdmin(keyword, status);
        Page<User> userPage = userRepository.findAll(spec, pageable);
        return  userPage.map(user -> userMapper.toUserSearchResByAdmin(user));
    }

    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_STAFF', 'ROLE_ADMIN')")
    public Page<SearchByUserRes> searchUserByUser(String keyword, String userDob, Pageable pageable){
        Specification<User> spec = UserByUserSpecification.searchByUser(keyword, userDob);
        Page<User> userPage = userRepository.findAll(spec, pageable);
        return userPage.map(user -> userMapper.toUserSearchResByUser(user));
    }

    @PreAuthorize("hasAnyRole('ROLE_STAFF', 'ROLE_ADMIN')")
    public GetUserProfileDetailByAdminRes getUserProfileByAdmin(String userId){
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not Found!"));

        return userMapper.toGetUserProfileDetailByAdminRes(user);

    }

    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_STAFF', 'ROLE_ADMIN')")
    public GetProfileDetailRes getProfileDetail(String userId){

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not Found!"));

        return userMapper.toGetProfileDetailRes(user);

    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public CreateUserRes createUser(CreateUserReq req){

        if(userRepository.existsByUserName(req.getUserName()))
            throw  new AppException((ErrorCode.USER_EXISTED));

        if(userRepository.existsByEmail(req.getEmail()))
            throw  new AppException((ErrorCode.EMAIl_EXISTED));

        MultipartFile image = req.getUserImg();
        String imgUrl = null;

        if(image != null && !image.isEmpty()){
            FileUpLoadUtil.assertAllowed(image, FileUpLoadUtil.IMAGE_PATTERN);
            String fileName = FileUpLoadUtil.getFileName(req.getUserName());
            CloudinaryRes cloudinaryRes = cloudinaryService.uploadFile(image, fileName);
            imgUrl = cloudinaryRes.getUrl();
        }

        User user =  userMapper.toCreateStaff(req);

        user.setUserImg(imgUrl);

        user.setPassword(passwordEncoder.encode(req.getPassword()));


        Role userRole = roleRepository.findByName(req.getRoles())
                .orElseThrow(() -> new RuntimeException("Role USER not found"));

        Set<Role> roles = new HashSet<>();

        roles.add(userRole);

        user.setRoles(roles);

        user.setStatus(Status.ACTIVE);

        return userMapper.toCreateStaffRes(userRepository.save(user));

    }

    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN','ROLE_STAFF')")
    public UpdateUserRes updateProfileById(String userId, UpdateUseReq request){

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not Found!"));

        if(userRepository.existsByUserName(request.getEmail()))
            throw  new AppException((ErrorCode.EMAIl_EXISTED));

        MultipartFile image = request.getUserImg();

        if(image != null && !image.isEmpty()){
            FileUpLoadUtil.assertAllowed(image, FileUpLoadUtil.IMAGE_PATTERN);
            String fileName = FileUpLoadUtil.getFileName(request.getUserName());
            CloudinaryRes cloudinaryRes = cloudinaryService.uploadFile(image, fileName);
            user.setUserImg(cloudinaryRes.getUrl());
        }

        userMapper.updateProfile(user, request);

        return userMapper.toResUpdateUser(userRepository.save(user));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public UpdateUserByAdminRes updateUserByAdmin(String userId, UpdateUserByAdminReq request){

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not Found!"));

        if(userRepository.existsByUserName(request.getUserName()))
            throw  new AppException((ErrorCode.USER_EXISTED));

        if(userRepository.existsByUserName(request.getEmail()))
            throw  new AppException((ErrorCode.EMAIl_EXISTED));

        MultipartFile image = request.getUserImg();

        if(image != null && !image.isEmpty()){
            FileUpLoadUtil.assertAllowed(image, FileUpLoadUtil.IMAGE_PATTERN);
            String fileName = FileUpLoadUtil.getFileName(request.getUserName());
            CloudinaryRes cloudinaryRes = cloudinaryService.uploadFile(image, fileName);
            user.setUserImg(cloudinaryRes.getUrl());
        }

        userMapper.updateUser(user, request);

        return userMapper.toResUpdateUserByAdmin(userRepository.save(user));
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }



}
