package com.example.diary.mapper;

import com.example.common.dto.diary.request.CreateDiaryReq;
import com.example.common.dto.diary.request.UpdateDiaryReq;
import com.example.common.dto.diary.request.UpdateDiaryRequest;
import com.example.common.dto.diary.request.UpdateItemsReq;
import com.example.common.dto.diary.response.*;
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

    CreateDiaryRes toCreateDiary(UserDiary userDiary);

    GetDiaryRes toGetDiary(UserDiary diary);

    GetListItemsDiary toOneDiaryItem(UserDiaryItem diaryItems);

    List<GetListItemsDiary> toGetListItemsDiary(UserDiaryItem diaryItems);

    @Mapping(source = "items", target = "items")
    GetDiaryDetailRes toGetDiaryDetail(UserDiary diary);

    DiaryItemResponse toItemResponse(UserDiaryItem item);

    List<DiaryItemResponse> toItemResponseList(List<UserDiaryItem> items);


    //** ===============================   CREATE RESPONSE   ===========================

    @Mapping(source = "userDiary.id", target = "id")
    @Mapping(source = "userDiary.diaryName", target = "diaryName")
    @Mapping(source = "userDiary.totalQuantity", target = "totalQuantity")
    @Mapping(source = "userDiary.totalAmount", target = "totalAmount")
    @Mapping(source = "userDiary.createdAt", target = "createAt")
    @Mapping(source = "userDiary.updateAt", target = "updateAt")
    @Mapping(source = "items", target = "items")
    CreateDiaryItemsRes toCreateItemRes(UserDiary userDiary, List<UserDiaryItem> items);

    @Mapping(source = "createAt", target = "createAt")
    @Mapping(source = "updateAt", target = "updateAt")
    ListItemInUserDiaryAfterCreate toItemRes(UserDiaryItem item);

    List<ListItemInUserDiaryAfterCreate> toListItemResponse(List<UserDiaryItem> items);

    @Mapping(target = "items", ignore = true)
    CreateDiaryRes toResponse(UserDiary diary);

    //** ===============================   UPDATE RESPONSE   ===========================


    @Mapping(source = "diaryStatus", target = "status")
    @Mapping(source = "updateAt", target = "updateAt")
    UpdateDiaryStatusRes toUpdateDiaryStatusRes(UserDiary diary);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "totalQuantity", ignore = true)
    @Mapping(target = "diaryStatus", ignore = true)
    @Mapping(target = "diaryDate", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "updateAt", ignore = true)
    void updateDiaryFromRequest(UpdateDiaryReq request, @MappingTarget UserDiary diary);

    UpdateDiaryRes toUpdateDiaryRes(UserDiary diary);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "diary", ignore = true)
    @Mapping(target = "productId", ignore = true)
    @Mapping(target = "createAt", ignore = true)
    @Mapping(target = "updateAt", ignore = true)
    void updateItemFromRequest(UpdateItemsReq request,
                               @MappingTarget UserDiaryItem item);

    UpdateItemRes toUpdateItemRes(UserDiaryItem item);
}
