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

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/color")
public class ColorController {

    private final ColorService colorService;

    @GetMapping("/get-color")
    public ApiResponse<List<GetColorRes>> getColor(){
        return ApiResponse.<List<GetColorRes>>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(colorService.getColor())
                .build();
    }

    @GetMapping("/detail-color/{colorId}")
    public ApiResponse<GetColorDetailRes> getColorById(@PathVariable String colorId){
        return ApiResponse.<GetColorDetailRes>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(colorService.getColorDetail(colorId))
                .build();
    }

    //? Định nghĩa Endpoint Có Body theo FormData
    @PostMapping(value = "/create-color", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<CreateColorRes> createColor(
            //? Set up các Key Và Value cho FormData
            @RequestPart("colorName") String colorName,
            @RequestPart(value = "colorCode") String colorCode,
            @RequestPart(value = "colorDescription") String colorDescription,
            @RequestPart(value = "colorImg") MultipartFile colorImg) {

        //? Điịnh nghĩa lại Object Dto CreateColorReq từ các Set up Key và Value
        CreateColorReq request = CreateColorReq.builder()
                .colorName(colorName)
                .colorCode(colorCode)
                .colorDescription(colorDescription)
                .colorImg(colorImg)
                .build();

        return ApiResponse.<CreateColorRes>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(colorService.createColor(request))
                .build();
    }

    @PatchMapping(value = "/edit-color/{colorId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<UpdateColorRes> updateColor(
            @PathVariable String colorId,
            @RequestPart(value = "colorName") String colorName,
            @RequestPart(value = "colorCode") String colorCode,
            @RequestPart(value = "colorDescription") String colorDescription,
            @RequestPart(value = "colorImg") MultipartFile colorImg
    ) {
        UpdateColorReq request = UpdateColorReq.builder()
                .colorCode(colorCode)
                .colorName(colorName)
                .colorDescription(colorDescription)
                .colorImg(colorImg)
                .build();

        return ApiResponse.<UpdateColorRes>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(colorService.updateColor(colorId, request))
                .build();
    }

    @GetMapping("/search-color")
    public Page<GetColorRes> searchColor(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "filter", required = false) String filter,
            @PageableDefault(size = 10, sort = "colorName", direction = Sort.Direction.ASC) Pageable pageable){
        return colorService.searchColor(keyword, filter, pageable);
    }

    @DeleteMapping("/delete-color/{colorId}")
    public ApiResponse<String> deleteColor(@PathVariable String colorId) {
        colorService.deleteColor(colorId);
        return ApiResponse.<String>builder()
                .status_code(HttpStatus.OK.value())
                .message("Delete Color Approved!")
                .build();
    }

}
