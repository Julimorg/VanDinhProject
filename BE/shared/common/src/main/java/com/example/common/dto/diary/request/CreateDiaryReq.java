package com.example.common.dto.diary.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateDiaryReq {

    @NotBlank(message = "Diary Name Can Not Be Empty!")
    private String diaryName;

    private String note;

}
