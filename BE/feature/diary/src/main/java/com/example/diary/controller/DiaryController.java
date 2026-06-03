package com.example.diary.controller;

import com.example.common.dto.diary.request.*;
import com.example.common.dto.diary.response.*;
import com.example.common.enums.SuccessCode;
import com.example.common.response.ApiResponse;
import com.example.common.interfaces.diary.DiaryService;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/diaries")
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;

    @PostMapping("/{userId}/create")
    public ApiResponse<CreateDiaryRes> createDiary(
            @PathVariable String userId,
            @Valid @RequestBody CreateDiaryReq request
    ) {
        return ApiResponse.<CreateDiaryRes>builder()
            .status_code(SuccessCode.CREATE_DIARY.getStatusCode().value())
            .message(SuccessCode.CREATE_DIARY.getMessage())
            .data(diaryService.createDiary(userId, request))
            .timestamp(LocalDateTime.now())
            .build();
    }

    @PostMapping("/{diaryId}/create-items")
    public ApiResponse<CreateDiaryItemsRes> createDiaryItems(
            @PathVariable String diaryId,
            @Valid @RequestBody List<CreateDiaryItemsReq> request
    ) {
        return ApiResponse.<CreateDiaryItemsRes>builder()
                .status_code(SuccessCode.CREATE_DIARY_ITEMS.getStatusCode().value())
                .message(SuccessCode.CREATE_DIARY_ITEMS.getMessage())
                .data(diaryService.createDiaryItems(diaryId, request))
                .timestamp(LocalDateTime.now())
                .build();
    }


    @GetMapping("/{userId}/get-all")
    public ApiResponse<Page<GetDiaryRes>> getDiaries(
            @PathVariable String userId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @PageableDefault(
            size = 20,
            sort = "createdAt",
            direction = Sort.Direction.DESC
        ) Pageable pageable
    ) {
        return ApiResponse.<Page<GetDiaryRes>>builder()
            .status_code(SuccessCode.GET_DIARIES.getStatusCode().value())
            .message(SuccessCode.GET_DIARIES.getMessage())
            .data(diaryService.getDiaries(userId, keyword,status, fromDate, toDate, pageable))
            .timestamp(LocalDateTime.now())
            .build();
    }

    @GetMapping("/{diaryId}/get-detail")
    public ApiResponse<GetDiaryDetailRes> getDiaryDetail(@PathVariable String diaryId) {
        return ApiResponse.<GetDiaryDetailRes>builder()
            .status_code(SuccessCode.GET_DIARY.getStatusCode().value())
            .message(SuccessCode.GET_DIARY.getMessage())
            .data(diaryService.getDiaryDetail(diaryId))
            .timestamp(LocalDateTime.now())
            .build();
    }

    @PatchMapping("/{userId}/{diaryId}/update-diary")
    public ApiResponse<UpdateDiaryRes> updateDiary(
            @PathVariable String userId,
            @PathVariable String diaryId,
            @Valid @RequestBody UpdateDiaryReq request
    ) {
        return ApiResponse.<UpdateDiaryRes>builder()
            .status_code(SuccessCode.UPDATE_DIARY.getStatusCode().value())
            .message(SuccessCode.UPDATE_DIARY.getMessage())
            .data(diaryService.updateDiary(userId, diaryId , request))
            .timestamp(LocalDateTime.now())
            .build();
    }

    @PatchMapping("/{userId}/{diaryId}/update-status")
    public ApiResponse<UpdateDiaryStatusRes> updateDiaryStatus(
            @PathVariable String userId,
            @PathVariable String diaryId,
            @Valid @RequestBody UpdateDiaryStatusReq request
    ) {
        return ApiResponse.<UpdateDiaryStatusRes>builder()
                .status_code(SuccessCode.UPDATE_STATUS.getStatusCode().value())
                .message(SuccessCode.UPDATE_STATUS.getMessage())
                .data(diaryService.updateDiaryStatus(userId, diaryId , request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PatchMapping("/{diaryId}/{itemId}/update-item")
    public ApiResponse<UpdateItemRes> updateDiary(
            @PathVariable String diaryId,
            @PathVariable String itemId,
            @Valid @RequestBody UpdateItemsReq request
    ) {
        return ApiResponse.<UpdateItemRes>builder()
                .status_code(SuccessCode.UPDATE_ITEM_DIARY.getStatusCode().value())
                .message(SuccessCode.UPDATE_ITEM_DIARY.getMessage())
                .data(diaryService.updateItems(diaryId, itemId , request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @DeleteMapping("/{diaryId}/{itemId}/delete-items")
    public ApiResponse<Void> deleteDiaryItem(
            @PathVariable String diaryId,
            @PathVariable String itemId) {
        diaryService.deleteDiaryItem(diaryId, itemId);
        return ApiResponse.<Void>builder()
                .status_code(SuccessCode.DELETE_ITEM_DIARY.getStatusCode().value())
                .message(SuccessCode.DELETE_ITEM_DIARY.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
    }

    @DeleteMapping("/{userId}/{diaryId}/delete-diary")
    public ApiResponse<Void> deleteDiary(
            @PathVariable String userId,
            @PathVariable String diaryId) {
        diaryService.deleteDiary(userId, diaryId);
        return ApiResponse.<Void>builder()
            .status_code(SuccessCode.DELETE_DIARY.getStatusCode().value())
            .message(SuccessCode.DELETE_DIARY.getMessage())
            .timestamp(LocalDateTime.now())
            .build();
    }
}
