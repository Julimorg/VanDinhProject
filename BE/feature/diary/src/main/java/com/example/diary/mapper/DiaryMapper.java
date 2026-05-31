package com.example.diary.mapper;

import com.example.common.dto.diary.request.UpdateDiaryRequest;
import com.example.common.dto.diary.response.DiaryItemResponse;
import com.example.common.dto.diary.response.DiaryResponse;
import com.example.common.dto.diary.response.DiarySummaryResponse;
import com.example.persistence.entity.UserDiary;
import com.example.persistence.entity.UserDiaryItem;
import java.util.List;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface DiaryMapper {
    DiaryItemResponse toItemResponse(UserDiaryItem item);

    List<DiaryItemResponse> toItemResponseList(List<UserDiaryItem> items);

    DiarySummaryResponse toSummaryResponse(UserDiary diary);

    @Mapping(target = "items", ignore = true)
    DiaryResponse toResponse(UserDiary diary);

    @BeanMapping(
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
    )
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    void updateDiaryFromRequest(
        UpdateDiaryRequest request,
        @MappingTarget UserDiary diary
    );
}
