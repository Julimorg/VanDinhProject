package com.example.common.dto.diary.request;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;

public record UpdateDiaryRequest(
    LocalDate diaryDate,
    String note,
    List<@Valid DiaryItemRequest> items
) {}
