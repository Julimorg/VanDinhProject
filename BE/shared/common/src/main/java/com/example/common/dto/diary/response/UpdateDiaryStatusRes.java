package com.example.common.dto.diary.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDiaryStatusRes {

    private String id;

    private String diaryName;

    private String status;

    private String note;

    private LocalDateTime updateAt;



}
