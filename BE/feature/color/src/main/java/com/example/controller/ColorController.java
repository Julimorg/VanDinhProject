package com.example.controller;
import com.cloudinary.Api;
import com.example.common.dto.color.request.CreateAlbumReq;
import com.example.common.dto.color.request.CreateColorReq;
import com.example.common.dto.color.request.UpdateColorReq;
import com.example.common.dto.color.response.*;
import com.example.common.enums.SuccessCode;
import com.example.common.response.ApiResponse;
import com.example.service.ColorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/color")
public class ColorController {

    private final ColorService colorService;


    @GetMapping("/color-selector/{supplierId}")
    public ApiResponse<List<GetColorWithSupplierRes>> getColorWithSupplier(@PathVariable String supplierId){
        return ApiResponse.<List<GetColorWithSupplierRes>>builder()
                .status_code(HttpStatus.OK.value())
                .message("Successfully!")
                .data(colorService.getColorWithSupplier(supplierId ))
                .timestamp(LocalDateTime.now())
                .build();
    }


    @GetMapping("/get-color")
    public ApiResponse<Page<GetColorRes>> getColor(
            @RequestParam(required = false) String supplierName,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "colorName", direction = Sort.Direction.ASC) Pageable pageable
    ){
        return ApiResponse.<Page<GetColorRes>>builder()
                .status_code(HttpStatus.OK.value())
                .message("Successfully!")
                .data(colorService.getColor(keyword, supplierName, pageable))
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

    @PostMapping(value = "create-album")
    public ApiResponse<CreateAlbumRes> createAlbum(@ModelAttribute CreateAlbumReq req){
        return ApiResponse.<CreateAlbumRes>builder()
                .status_code(SuccessCode.CREATE_ALBUM.getStatusCode().value())
                .message(SuccessCode.CREATE_ALBUM.getMessage())
                .data(colorService.createAlbum(req))
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
