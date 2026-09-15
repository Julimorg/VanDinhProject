package com.example.controller;
import com.cloudinary.Api;
import com.example.common.dto.color.request.CreateAlbumReq;
import com.example.common.dto.color.request.CreateColorReq;
import com.example.common.dto.color.request.UpdateAlbumReq;
import com.example.common.dto.color.request.UpdateColorReq;
import com.example.common.dto.color.response.*;
import com.example.common.enums.SuccessCode;
import com.example.common.interfaces.color.ColorServiceInterface;
import com.example.common.response.ApiResponse;
import com.example.common.service.ExcelImportService;
import com.example.service.ColorImportHandler;
import com.example.service.ColorService;
import lombok.RequiredArgsConstructor;
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

    private final ColorServiceInterface colorService;

    private final ColorImportHandler colorImportHandler;

    private final ExcelImportService excelImportService;

    @GetMapping("/color-selector/{supplierId}")
    public ApiResponse<List<GetColorWithSupplierRes>> getColorWithSupplier(@PathVariable String supplierId){
        return ApiResponse.<List<GetColorWithSupplierRes>>builder()
                .status_code(HttpStatus.OK.value())
                .message("Successfully!")
                .data(colorService.getColorWithSupplier(supplierId ))
                .timestamp(LocalDateTime.now())
                .build();
    }


    @GetMapping("/get-color/{supplierId}")
    public ApiResponse<Page<GetColorRes>> getColor(
            @PathVariable String supplierId,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "colorName", direction = Sort.Direction.ASC) Pageable pageable
    ){
        return ApiResponse.<Page<GetColorRes>>builder()
                .status_code(SuccessCode.GET_COLOR.getStatusCode().value())
                .message(SuccessCode.GET_COLOR.getMessage())
                .data(colorService.getColorBySupplier(keyword, supplierId, pageable))
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

    @PatchMapping(value = "/update-album/{albumId}")
    public ApiResponse<UpdateAlbumRes> updateAlbum(@PathVariable String albumId, @ModelAttribute UpdateAlbumReq req){
        return ApiResponse.<UpdateAlbumRes>builder()
                .status_code(SuccessCode.UPDATE_ALBUM.getStatusCode().value())
                .message(SuccessCode.UPDATE_ALBUM.getMessage())
                .data(colorService.updateAlbum(albumId,req))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/get-album")
    public ApiResponse<List<GetListAlbumRes>> getAlbums(){
        return ApiResponse.<List<GetListAlbumRes>>builder()
                .status_code(SuccessCode.GET_ALBUM.getStatusCode().value())
                .message(SuccessCode.GET_ALBUM.getMessage())
                .data(colorService.getListAlbum())
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

//    @PostMapping(value = "/excel", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ApiResponse<ImportColorRes> importExcel(@RequestParam("file") MultipartFile file) {
//        return ApiResponse.<ImportColorRes>builder()
//                .status_code(SuccessCode.IMPORT_COLOR_EXCEL.getStatusCode().value())
//                .message(SuccessCode.IMPORT_COLOR_EXCEL.getMessage())
//                .data(excelImportService.importExcel(file, colorImportHandler)) // ← đổi cho khớp engine của bạn
//                .timestamp(LocalDateTime.now())
//                .build();
//    }

    @PostMapping(value = "/json/import-color", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ImportColorRes> importJson(@RequestParam("file") MultipartFile file) {
        return ApiResponse.<ImportColorRes>builder()
                .status_code(SuccessCode.IMPORT_COLOR.getStatusCode().value())
                .message(SuccessCode.IMPORT_COLOR.getMessage())
                .data(colorService.importColorFromJson(file))
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

    @DeleteMapping("/delete-album/{albumId}")
    public ApiResponse<String> deleteAlbum(@PathVariable String albumId){
        colorService.deleteAlbum(albumId);
        return ApiResponse.<String>builder()
                .status_code(SuccessCode.DELETE_ALBUM.getStatusCode().value())
                .message(SuccessCode.DELETE_ALBUM.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
    }

}
