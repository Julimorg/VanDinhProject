package com.example.diary.service;

import com.example.common.dto.diary.request.CreateDiaryRequest;
import com.example.common.dto.diary.request.UpdateDiaryRequest;
import com.example.common.dto.diary.response.DiaryResponse;
import com.example.common.dto.diary.response.DiarySummaryResponse;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DiaryService {
    DiaryResponse createDiary(CreateDiaryRequest request);
    Page<DiarySummaryResponse> getDiaries(
        String keyword,
        LocalDate fromDate,
        LocalDate toDate,
        Pageable pageable
    );
    DiaryResponse getDiary(String id);
    DiaryResponse updateDiary(String id, UpdateDiaryRequest request);
    void deleteDiary(String id);
}
