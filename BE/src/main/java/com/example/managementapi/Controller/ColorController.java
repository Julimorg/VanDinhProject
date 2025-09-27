package com.example.managementapi.Controller;


import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Request.Color.CreateColorReq;
import com.example.managementapi.Dto.Request.Color.UpdateColorReq;
import com.example.managementapi.Dto.Response.Color.CreateColorRes;
import com.example.managementapi.Dto.Response.Color.GetColorDetailRes;
import com.example.managementapi.Dto.Response.Color.GetColorRes;
import com.example.managementapi.Dto.Response.Color.UpdateColorRes;
import com.example.managementapi.Service.ColorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/color")
public class ColorController {

    private final ColorService colorService;

    @GetMapping("/search-color")
    public ApiResponse<Page<GetColorRes>> searchColor(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "filter", required = false) String filter,
            @PageableDefault(size = 10, sort = "colorName", direction = Sort.Direction.ASC) Pageable pageable){

        return ApiResponse.<Page<GetColorRes>>builder()
                .status_code(HttpStatus.OK.value())
                .message("Successfully!")
                .data(colorService.searchColor(keyword, filter, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }


    @GetMapping("/get-color")
    public ApiResponse<Page<GetColorRes>> getColor(
            @RequestParam(required = false) String supplierName,
            @PageableDefault(size = 10, sort = "colorName", direction = Sort.Direction.ASC) Pageable pageable
    ){
        return ApiResponse.<Page<GetColorRes>>builder()
                .status_code(HttpStatus.OK.value())
                .message("Successfully!")
                .data(colorService.getColor(supplierName, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/detail-color/{colorId}")
    public ApiResponse<GetColorDetailRes> getColorById(@PathVariable String colorId){
        return ApiResponse.<GetColorDetailRes>builder()
                .status_code(HttpStatus.OK.value())
                .message("Successfully")
                .data(colorService.getColorDetail(colorId))
                .timestamp(LocalDateTime.now())
                .build();
    }

    //? Định nghĩa Endpoint Có Body theo FormData
    @PostMapping(value = "/create-color", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<CreateColorRes> createColor(@ModelAttribute CreateColorReq request) {

        return ApiResponse.<CreateColorRes>builder()
                .status_code(HttpStatus.OK.value())
                .message("Create Color Successfully!")
                .data(colorService.createColor(request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PatchMapping(value = "/edit-color/{colorId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<UpdateColorRes> updateColor(@PathVariable String colorId, @ModelAttribute UpdateColorReq request) {

        return ApiResponse.<UpdateColorRes>builder()
                .status_code(HttpStatus.OK.value())
                .message("Update Color Successfully!")
                .data(colorService.updateColor(colorId, request))
                .timestamp(LocalDateTime.now())
                .build();
    }


    @DeleteMapping("/delete-color/{colorId}")
    public ApiResponse<String> deleteColor(@PathVariable String colorId) {
        colorService.deleteColor(colorId);
        return ApiResponse.<String>builder()
                .status_code(HttpStatus.OK.value())
                .message("Delete Color Successfully!")
                .timestamp(LocalDateTime.now())
                .build();
    }

}
