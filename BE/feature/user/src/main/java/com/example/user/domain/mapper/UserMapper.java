package com.example.user.domain.mapper;



import com.example.common.dto.user.request.CreateUserReq;
import com.example.common.dto.user.response.CreateUserRes;
import com.example.common.dto.user.response.GetMyProfileDetailRes;
import com.example.persistence.entity.User;
import com.example.common.dto.user.response.GetUserRes;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {

    //* =========================== GET MAPPER ===========================

    GetUserRes toGetUser(User user);

//    SearchByAdminRes toUserSearchResByAdmin(User user);
//
//    SearchByUserRes toUserSearchResByUser(User user);
//
//    GetUserProfileDetailByAdminRes toGetUserProfileDetailByAdminRes(User user);
//
    GetMyProfileDetailRes toGetProfileDetailRes(User user);
//
//    //* =========================== POST MAPPER ===========================
//
//    @Mapping(target = "userImg", ignore = true)
//    @Mapping(target = "status", ignore = true)
//    @Mapping(target = "roles", ignore = true)
//    User toCreateStaff(CreateUserReq request);
//
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userImg", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createAt", ignore = true)
    @Mapping(target = "updateAt", ignore = true)
    @Mapping(target = "forgotPassword", ignore = true)
    User toCreateUser(CreateUserReq request);

    CreateUserRes toCreateUserRes(User user);
//
//    SignUpUserRes toSignUpUserRes(User user);
//
//    //* =========================== UPDATE MAPPER ===========================
//
//    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
//    @Mapping(target = "userImg", ignore = true)
//    void updateProfile(@MappingTarget User user, UpdateUseReq request);
//
//    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
//    @Mapping(target = "userImg", ignore = true)
//    void updateUser(@MappingTarget User user, UpdateUserByAdminReq request);
//
//    UpdateUserByAdminRes toResUpdateUserByAdmin(User user);
//
//    UpdateUserRes toResUpdateUser(User user);
//
//    GetUserSelectionRes toGetUserSelection(User user);

}
