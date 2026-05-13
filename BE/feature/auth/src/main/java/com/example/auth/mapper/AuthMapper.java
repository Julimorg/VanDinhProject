package com.example.auth.mapper;

import com.example.common.dto.auth.response.LoginRes;
import com.example.common.dto.auth.response.RefreshRes;
import com.example.common.dto.auth.response.SignUpUserRes;
import com.example.persistence.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AuthMapper {

    LoginRes toLoginRes(User user);

    SignUpUserRes toSignUpUserRes(User user);

    RefreshRes toRefreshRes(User user);

}
