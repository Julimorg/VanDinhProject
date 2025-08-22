package com.example.managementapi.Controller;


import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Request.Permission.CreatePermissionReq;
import com.example.managementapi.Dto.Response.Permission.CreatePermissionRes;
import com.example.managementapi.Dto.Response.Permission.GetPermissionRes;
import com.example.managementapi.Repository.PermissionRepository;
import com.example.managementapi.Service.PermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/permissions")
@RequiredArgsConstructor
@Slf4j
public class PermissionController {

    @Autowired
    private final PermissionRepository permissionRepository;

    @Autowired
    private final PermissionService premissionService;


    @PostMapping("/create-permission")
    ApiResponse<CreatePermissionRes> createPermission(@RequestBody CreatePermissionReq request) {
        return ApiResponse.<CreatePermissionRes>builder()
                .code(1000)
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(premissionService.createPermission(request))
                .build();
    }


    @GetMapping("/get-permission")
    ApiResponse<List<GetPermissionRes>> getPermission() {
        return ApiResponse.<List<GetPermissionRes>>builder()
                .code(1000)
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(premissionService.getPermission())
                .build();
    }

    @DeleteMapping("/delete-permission")
    ApiResponse<String> deletePermission(){
        return ApiResponse.<String>builder()
                .code(1000)
                .status_code(HttpStatus.OK.value())
                .message("Delete successfull!")
                .build();
    }


}
