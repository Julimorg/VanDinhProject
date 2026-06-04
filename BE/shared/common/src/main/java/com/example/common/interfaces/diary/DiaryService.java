package com.example.common.interfaces.diary;

import com.example.common.dto.diary.request.*;
import com.example.common.dto.diary.response.*;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DiaryService {

    @Transactional
    CreateDiaryRes createDiary(String userId, CreateDiaryReq request);

    @Transactional
    CreateDiaryItemsRes createDiaryItems(String diaryId,
                                         List<CreateDiaryItemsReq> request);

    @Transactional
    UpdateDiaryRes updateDiary(String userId,
                               String diaryId,
                               UpdateDiaryReq request);

    @Transactional
    UpdateItemRes updateItems(String diaryId,
                               String itemId,
                               UpdateItemsReq request);

    @Transactional
    UpdateDiaryStatusRes updateDiaryStatus(String diaryId,
                                           UpdateDiaryStatusReq request);

    Page<GetDiaryRes> getDiaries(
            String userId,
            String keyword,
            String status,
            String fromDate,
            String toDate,
            Pageable pageable
    );

    GetDiaryDetailRes getDiaryDetail(String diaryId);

    void deleteDiary(String userId, String diaryId);

    @Transactional
    void deleteDiaryItem(String diaryId, String itemId);
}
