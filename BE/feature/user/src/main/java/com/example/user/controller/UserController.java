package com.example.user.controller;

import com.example.common.dto.user.request.CreateUserReq;
import com.example.common.dto.user.request.UpdateMyProfileReq;
import com.example.common.dto.user.request.UpdateUserByAdminReq;
import com.example.common.dto.user.response.*;
import com.example.common.enums.SuccessCode;
import com.example.common.response.ApiResponse;
import com.example.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/users")
public class UserController {

    private final UserService userService;


    @GetMapping("/selection")
    public ApiResponse<List<GetUserSelectionRes>> getUserSelection(){
        return ApiResponse.<List<GetUserSelectionRes>>
                        builder()
                .status_code(SuccessCode.GET_USER_SELECTION.getStatusCode().value())
                .message(SuccessCode.LOGIN_SUCCESSFULLY.getMessage())
                .data(userService.getUserSelection())
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/get-user")
    ApiResponse<Page<GetUserRes>> getUser(
            //? Đây là những Page default nếu không truyền trên url
            //? ví dụ GET /api/v1/users/search-user
            //?          page = 0 (default 0-based)
            //?          size = 10
            //?          sort = createAt, asc
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String role,
            @PageableDefault(size = 10, sort = "userName", direction = Sort.Direction.ASC) Pageable pageable
    ){
        return ApiResponse.<Page<GetUserRes>>builder()
                .status_code(SuccessCode.GET_USER.getStatusCode().value())
                .message(SuccessCode.GET_USER.getMessage())
                .data(userService.getUsersByAdmin(keyword, status, role, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/get-profile/{userId}")
    public ApiResponse<GetUserProfileDetailByAdminRes> getUserProfileByAdmin(@PathVariable String userId){
        return ApiResponse.<GetUserProfileDetailByAdminRes>
                        builder()
                .status_code(SuccessCode.GET_USER_PROFILE_DETAIL.getStatusCode().value())
                .message(SuccessCode.GET_USER_PROFILE_DETAIL.getMessage())
                .data(userService.getUserProfileByAdmin(userId))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/view-profile/{userId}")
    public ApiResponse<GetMyProfileDetailRes> getMyProfile(@PathVariable String userId){
        return ApiResponse.<GetMyProfileDetailRes>builder()
                .status_code(SuccessCode.GET_MY_PROFILE.getStatusCode().value())
                .message(SuccessCode.GET_MY_PROFILE.getMessage())
                .data(userService.getMyProfile(userId))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PostMapping(value = "/create-user", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<CreateUserRes> createStaff(@Valid @ModelAttribute CreateUserReq request){
        return ApiResponse.<CreateUserRes>builder()
                .status_code(SuccessCode.CREATE_USER.getStatusCode().value())
                .message(SuccessCode.CREATE_USER.getMessage())
                .data(userService.createUser(request))
                .timestamp(LocalDateTime.now())

                .build();
    }

    @PatchMapping(value = "/update-profile/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<UpdateMyProfileRes> updateProfileById(@PathVariable String userId,
                                                      @ModelAttribute @Valid UpdateMyProfileReq request){
        return ApiResponse.<UpdateMyProfileRes>builder()
                .status_code(SuccessCode.UPDATE_MY_PROFILE.getStatusCode().value())
                .message(SuccessCode.UPDATE_MY_PROFILE.getMessage())
                .data(userService.updateMyProfile(userId, request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PatchMapping(value = "/update-user/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<UpdateUserByAdminRes> updateUserByAdmin(@PathVariable String userId,
                                                        @ModelAttribute @Valid UpdateUserByAdminReq request){
        return ApiResponse.<UpdateUserByAdminRes>builder()
                .status_code(SuccessCode.UPDATE_USER_PROFILE.getStatusCode().value())
                .message(SuccessCode.UPDATE_USER_PROFILE.getMessage())
                .data(userService.updateUserByAdmin(userId, request))
                .timestamp(LocalDateTime.now())

                .build();
    }

    @DeleteMapping("/delete-user/{userId}")
    ApiResponse<String> deleteUserById(@PathVariable String userId){
        userService.deleteUser(userId);
        return ApiResponse.<String>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data("User has been deleted")
                .timestamp(LocalDateTime.now())

                .build();
    }


}
