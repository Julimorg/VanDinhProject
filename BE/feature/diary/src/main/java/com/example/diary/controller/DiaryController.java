package com.example.diary.controller;

import com.example.common.dto.diary.request.CreateDiaryReq;
import com.example.common.dto.diary.request.CreateDiaryRequest;
import com.example.common.dto.diary.request.UpdateDiaryRequest;
import com.example.common.dto.diary.response.CreateDiaryRes;
import com.example.common.dto.diary.response.DiarySummaryResponse;
import com.example.common.dto.diary.response.GetDiaryRes;
import com.example.common.enums.SuccessCode;
import com.example.common.response.ApiResponse;
import com.example.common.interfaces.diary.DiaryService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/diaries")
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;

    @PostMapping
    public ApiResponse<CreateDiaryRes> createDiary(
        @Valid @RequestBody CreateDiaryReq request
    ) {
        return ApiResponse.<CreateDiaryRes>builder()
            .status_code(SuccessCode.CREATE_DIARY.getStatusCode().value())
            .message(SuccessCode.CREATE_DIARY.getMessage())
            .data(diaryService.createDiary(request))
            .timestamp(LocalDateTime.now())
            .build();
    }

    @GetMapping
    public ApiResponse<Page<GetDiaryRes>> getDiaries(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String fromDate,
        @RequestParam(required = false) String toDate,
        @PageableDefault(
            size = 20,
            sort = "diaryDate",
            direction = Sort.Direction.DESC
        ) Pageable pageable
    ) {
        return ApiResponse.<Page<GetDiaryRes>>builder()
            .status_code(SuccessCode.GET_DIARIES.getStatusCode().value())
            .message(SuccessCode.GET_DIARIES.getMessage())
            .data(diaryService.getDiaries(keyword, fromDate, toDate, pageable))
            .timestamp(LocalDateTime.now())
            .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<CreateDiaryRes> getDiary(@PathVariable String id) {
        return ApiResponse.<CreateDiaryRes>builder()
            .status_code(SuccessCode.GET_DIARY.getStatusCode().value())
            .message(SuccessCode.GET_DIARY.getMessage())
            .data(diaryService.getDiaryDetail(id))
            .timestamp(LocalDateTime.now())
            .build();
    }

    @PatchMapping("/{id}")
    public ApiResponse<CreateDiaryRes> updateDiary(
        @PathVariable String id,
        @Valid @RequestBody UpdateDiaryRequest request
    ) {
        return ApiResponse.<CreateDiaryRes>builder()
            .status_code(SuccessCode.UPDATE_DIARY.getStatusCode().value())
            .message(SuccessCode.UPDATE_DIARY.getMessage())
            .data(diaryService.updateDiary(id, request))
            .timestamp(LocalDateTime.now())
            .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteDiary(@PathVariable String id) {
        diaryService.deleteDiary(id);
        return ApiResponse.<Void>builder()
            .status_code(SuccessCode.DELETE_DIARY.getStatusCode().value())
            .message(SuccessCode.DELETE_DIARY.getMessage())
            .timestamp(LocalDateTime.now())
            .build();
    }
}
