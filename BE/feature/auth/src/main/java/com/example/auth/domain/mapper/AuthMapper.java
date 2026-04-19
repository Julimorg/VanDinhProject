package com.example.auth.domain.mapper;

import com.example.auth.domain.dto.request.LoginReq;
import com.example.auth.domain.dto.response.LoginRes;
import com.example.auth.domain.dto.response.RefreshRes;
import com.example.auth.domain.dto.response.SignUpUserRes;
import com.example.persistence.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")

public interface AuthMapper {

    LoginRes toLoginRes(User user);

    SignUpUserRes toSignUpUserRes(User user);

    RefreshRes toRefreshRes(User user);
}
