package com.example.managementapi.Controller;

import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Request.User.CreateStaffReq;
import com.example.managementapi.Dto.Request.User.UpdateUseReq;
import com.example.managementapi.Dto.Request.User.UpdateUserByAdminReq;
import com.example.managementapi.Dto.Response.User.*;
import com.example.managementapi.Service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/get-user")
    ApiResponse<List<GetUserRes>> getUser(){
        log.warn(String.valueOf(HttpStatus.OK));
        return ApiResponse.<List<GetUserRes>>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(userService.getUser())
                .timestamp(LocalDateTime.now())
                .build();
    }


    @GetMapping("/search-user")
    public Page<SearchByAdminRes> searchUserByAdmin(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "status" , required = false) String status,
            //? Đây là những Page default nếu không truyền trên url
            //? ví dụ GET /api/v1/users/search-user
            //?          page = 0 (default 0-based)
            //?          size = 10
            //?          sort = createAt, asc
            @PageableDefault(size = 10, sort = "createAt", direction = Sort.Direction.ASC) Pageable pageable){
                return userService.searchUserByAdmin(keyword, status, pageable);
    }

    @GetMapping("/search")
    public ApiResponse<Page<SearchByUserRes>> searchUserByUser(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "dob", required = false) String userDob,
            @PageableDefault(size = 10, sort = "createAt", direction = Sort.Direction.ASC) Pageable pageable){
        return ApiResponse.<Page<SearchByUserRes>>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(userService.searchUserByUser(userDob, keyword, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PostMapping(value = "/create-staff", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<CreateStaffRes> createStaff( @Valid @ModelAttribute CreateStaffReq request){
        return ApiResponse.<CreateStaffRes>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(userService.createStaff(request))
                .timestamp(LocalDateTime.now())

                .build();
    }


    @PatchMapping(value = "/update-profile/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<UpdateUserRes> updateProfileById(@PathVariable String userId, @ModelAttribute @Valid UpdateUseReq request){
        return ApiResponse.<UpdateUserRes>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(userService.updateProfileById(userId, request))
                .timestamp(LocalDateTime.now())

                .build();
    }

    @PatchMapping(value = "/update-user/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<UpdateUserByAdminRes> updateUserByAdmin(@PathVariable String userId, @ModelAttribute @Valid UpdateUserByAdminReq request){
        return ApiResponse.<UpdateUserByAdminRes>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
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
