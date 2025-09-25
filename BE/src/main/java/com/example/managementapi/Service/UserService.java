package com.example.managementapi.Service;
import com.example.managementapi.Dto.Request.User.CreateStaffReq;
import com.example.managementapi.Dto.Request.User.UpdateUseReq;
import com.example.managementapi.Dto.Request.User.UpdateUserByAdminReq;
import com.example.managementapi.Dto.Response.Cloudinary.CloudinaryRes;
import com.example.managementapi.Dto.Response.User.*;
import com.example.managementapi.Entity.Role;
import com.example.managementapi.Entity.User;
import com.example.managementapi.Enum.ErrorCode;
import com.example.managementapi.Enum.Status;
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


@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;
    private final CloudinaryService cloudinaryService;


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public List<GetUserRes> getUser(){
        return userRepository.findAll().stream()
                .map(user -> userMapper.toGetUser(user)).toList();

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

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public CreateStaffRes createStaff(CreateStaffReq req){

        MultipartFile image = req.getUserImg();
        String imgUrl = null;

        if(image != null && !image.isEmpty()){
            FileUpLoadUtil.assertAllowed(image, FileUpLoadUtil.IMAGE_PATTERN);
            String fileName = FileUpLoadUtil.getFileName(req.getUserName());
            CloudinaryRes cloudinaryRes = cloudinaryService.uploadFile(image, fileName);
            imgUrl = cloudinaryRes.getUrl();
        }

        if(userRepository.existsByUserName(req.getUserName()))
            throw  new AppException((ErrorCode.USER_EXISTED));


        User user =  userMapper.toCreateStaff(req);

        user.setUserImg(imgUrl);

        user.setPassword(passwordEncoder.encode(req.getPassword()));

        Role staffRole = roleRepository.findByName("STAFF").orElseGet(() -> {
            Role newRole = Role.builder()
                    .name("STAFF")
                    .description("Default Staff role")
                    .build();
            return roleRepository.save(newRole);
        });
        user.setStatus(Status.ACTIVE);

        Set<Role> roles = new HashSet<>();
        roles.add(staffRole);

        user.setRoles(roles);

        return userMapper.toCreateStaffRes(userRepository.save(user));

    }

    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_STAFF', 'ROLE_ADMIN')")
//    @PostAuthorize("returnObject.userName == authentication.name")
    public UpdateUserRes updateProfileById(String userId, UpdateUseReq request){
        MultipartFile image = request.getUserImg();
        String imgUrl = null;

        if(image != null && !image.isEmpty()){
            FileUpLoadUtil.assertAllowed(image, FileUpLoadUtil.IMAGE_PATTERN);
            String fileName = FileUpLoadUtil.getFileName(request.getUserName());
            CloudinaryRes cloudinaryRes = cloudinaryService.uploadFile(image, fileName);
            imgUrl = cloudinaryRes.getUrl();
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not Found!"));

        user.setUserImg(imgUrl);

        userMapper.updateProfile(user, request);

        return userMapper.toResUpdateUser(userRepository.save(user));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public UpdateUserByAdminRes updateUserByAdmin(String userId, UpdateUserByAdminReq request){
        MultipartFile image = request.getUserImg();
        String imgUrl = null;

        if(image != null && !image.isEmpty()){
            FileUpLoadUtil.assertAllowed(image, FileUpLoadUtil.IMAGE_PATTERN);
            String fileName = FileUpLoadUtil.getFileName(request.getUserName());
            CloudinaryRes cloudinaryRes = cloudinaryService.uploadFile(image, fileName);
            imgUrl = cloudinaryRes.getUrl();
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not Found!"));

        user.setUserImg(imgUrl);

        userMapper.updateUser(user, request);

        return userMapper.toResUpdateUserByAdmin(userRepository.save(user));
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }



}
