package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Request.Auth.SignUpReq;
import com.example.managementapi.Dto.Request.User.CreateStaffReq;
import com.example.managementapi.Dto.Request.User.UpdateUserByAdminReq;
import com.example.managementapi.Dto.Request.User.UpdateUseReq;
import com.example.managementapi.Dto.Response.User.*;
import com.example.managementapi.Entity.User;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    //* =========================== GET MAPPER ===========================
    User toUser(SignUpReq request);

    GetUserRes toGetUser(User user);

    SearchByAdminRes toUserSearchResByAdmin(User user);

    SearchByUserRes toUserSearchResByUser(User user);

    //* =========================== POST MAPPER ===========================

    @Mapping(target = "userImg", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "roles", ignore = true)
    User toCreateStaff(CreateStaffReq request);

    CreateStaffRes toCreateStaffRes(User user);

    SignUpUserRes toSignUpUserRes(User user);

    //* =========================== UPDATE MAPPER ===========================


    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "userImg", ignore = true)
    void updateProfile(@MappingTarget User user, UpdateUseReq request);

    @Mapping(target = "userImg", ignore = true)
    void updateUser(@MappingTarget User user, UpdateUserByAdminReq request);

    UpdateUserByAdminRes toResUpdateUserByAdmin(User user);

    UpdateUserRes toResUpdateUser(User user);





}
