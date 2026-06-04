package com.example.common.dto.diary.request;

import com.example.persistence.enumTable.DiaryStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDiaryStatusReq {


    @NotNull(message = "Diary Status Can Not Be Empty!")
    private DiaryStatus diaryStatus;

}
