package com.example.common.interfaces.diary;

import com.example.common.dto.diary.request.CreateDiaryItemsReq;
import com.example.common.dto.diary.request.CreateDiaryReq;
import com.example.common.dto.diary.request.UpdateDiaryRequest;
import com.example.common.dto.diary.response.CreateDiaryItemsRes;
import com.example.common.dto.diary.response.CreateDiaryRes;
import com.example.common.dto.diary.response.GetDiaryDetailRes;
import com.example.common.dto.diary.response.GetDiaryRes;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DiaryService {

    @Transactional
    CreateDiaryRes createDiary(CreateDiaryReq request);

    @Transactional
    CreateDiaryItemsRes createDiaryItems(String diaryId,
                                         List<CreateDiaryItemsReq> request);

    Page<GetDiaryRes> getDiaries(
        String keyword,
        String fromDate,
        String toDate,
        Pageable pageable
    );

    GetDiaryDetailRes getDiaryDetail(String id);

    CreateDiaryRes updateDiary(String id, UpdateDiaryRequest request);

    void deleteDiary(String id);

    void deleteDiaryItem(String diaryId, String itemId);
}
