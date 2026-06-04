package com.example.common.dto.diary.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record CreateDiaryRequest(
    @NotNull LocalDate diaryDate,

    String note,

    @NotEmpty List<@Valid DiaryItemRequest> items
) {}
