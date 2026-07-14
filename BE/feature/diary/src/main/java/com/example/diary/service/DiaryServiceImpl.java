package com.example.diary.service;
import com.example.common.dto.diary.request.*;
import com.example.common.dto.diary.response.*;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.diary.DiaryService;
import com.example.common.interfaces.user.UserInternalService;
import com.example.common.util.GenerateRandomCode;
import com.example.diary.config.DiarySpecification;
import com.example.diary.mapper.DiaryMapper;
import com.example.diary.repository.UserDiaryItemRepository;
import com.example.diary.repository.UserDiaryRepository;
import com.example.persistence.entity.*;
import com.example.persistence.enumTable.DiaryStatus;
import com.example.security.Util.UtilSecurityClass;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
public class DiaryServiceImpl implements DiaryService {

    private final UserDiaryRepository diaryRepository;

    private final UserDiaryItemRepository itemRepository;

    private final DiaryMapper mapper;

    private final UserInternalService userInternalService;

    private final UtilSecurityClass utilSecurityClass;

    private final GenerateRandomCode generateRandomCode;

    private void reCalculateUserDiary(UserDiary userDiary,
                                      List<UserDiaryItem> items) {
        int totalQuantity = 0;
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (UserDiaryItem item : items) {
            totalQuantity += item.getQuantity();
            totalPrice = totalPrice.add(
                    item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
            );
        }

        userDiary.setTotalQuantity(BigDecimal.valueOf(totalQuantity));

        userDiary.setTotalAmount(totalPrice);
    }

    private UserDiary findDiaryOrThrow(String id) {
        return diaryRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DIARY_NOT_FOUND));
    }


    @Override
    public Page<GetDiaryRes> getDiaries(
            String userId,
            String keyword,
            String status,
            String fromDate,
            String toDate,
            Pageable pageable
    ) {
        Specification<UserDiary> spec = DiarySpecification.from(
                DiarySpecification.DiaryFilter.of(userId,keyword, status, fromDate, toDate)
        );
        return diaryRepository
                .findAll(spec, pageable)
                .map(mapper::toGetDiary);
    }

    @Override
    public GetDiaryDetailRes getDiaryDetail (String diaryId) {

        UserDiary diary = findDiaryOrThrow(diaryId);

        LinkedHashMap<LocalDateTime, List<UserDiaryItem>> groupItemWithDate = new LinkedHashMap<>();

        List<UserDiaryItem> items = itemRepository.findByDiaryIdOrderByItemDateAsc(diaryId);

        for(UserDiaryItem item : items ) {

            LocalDateTime date = item.getItemDate();

            if (!groupItemWithDate.containsKey(date)) {
                groupItemWithDate.put(date, new ArrayList<>());
            }

            groupItemWithDate.get(date).add(item);
        }

        List<DiaryDayGroup> days = new ArrayList<>();

        for(Map.Entry<LocalDateTime, List<UserDiaryItem>> entry : groupItemWithDate.entrySet()) {

            LocalDateTime date = entry.getKey();

            List<UserDiaryItem> itemsOfDay = entry.getValue();

            List<GetListItemsDiary> mapped = new ArrayList<>();

            BigDecimal calcTotalDay = BigDecimal.ZERO;

            int totalQuantityInDay = 0;

            for (UserDiaryItem item : itemsOfDay) {

                BigDecimal totalAvgInOneItem = item.getUnitPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity()));

                totalQuantityInDay += item.getQuantity();

                calcTotalDay = calcTotalDay.add(totalAvgInOneItem);

                GetListItemsDiary dto = mapper.toGetListItemsDiary(item);

                mapped.add(dto);

            }

            DiaryDayGroup group = DiaryDayGroup.builder()
                    .date(date)
                    .itemCount(totalQuantityInDay)
                    .totalDay(calcTotalDay)
                    .items(mapped)
                    .build();

            days.add(group);
        }

        return mapper.toGetDiaryDetailRes(diary, days);
    }


    @Transactional
    @Override
    public CreateDiaryRes createDiary(String userId, CreateDiaryReq request) {

        User user = userInternalService.getUserById(userId);

        UserDiary diary = UserDiary.builder()
                .user(user)
                .diaryCode(generateRandomCode.generateDiaryCode())
                .diaryName(request.getDiaryName())
                .diaryStatus(DiaryStatus.UNPAID)
                .note(request.getNote())
                .createdBy(utilSecurityClass.getCurrentUsername())
                .startDate(LocalDateTime.now())
                .build();

        diary = diaryRepository.save(diary);

        return mapper.toCreateDiary(diary);
    }

    @Override
    public CreateDiaryItemsRes createDiaryItems(String diaryId,List<CreateDiaryItemsReq> request) {

        UserDiary userDiary = findDiaryOrThrow(diaryId);

        List<UserDiaryItem> items = request.stream()
                .map(req ->  UserDiaryItem.builder()
                        .diary(userDiary)
                        .productName(req.getProductName())
                        .itemDate(req.getItemDate().atStartOfDay())
                        .quantity(req.getQuantity())
                        .volume(req.getVolume())
                        .color(req.getColor())
                        .unitPrice(req.getUnitPrice())
                        .itemNote(req.getItemNote())
                        .build()
                ).toList();

        itemRepository.saveAll(items);

        List<UserDiaryItem> allItems = itemRepository.findByDiaryId(diaryId);

        reCalculateUserDiary(userDiary, allItems);

        diaryRepository.save(userDiary);

        return mapper.toCreateItemRes(userDiary,allItems);
    }


    @Override
    @Transactional
    public UpdateDiaryRes updateDiary(String userId,
                                      String diaryId,
                                      UpdateDiaryReq request) {

        userInternalService.getUserById(userId);

        UserDiary userDiary = findDiaryOrThrow(diaryId);

        if (!userDiary.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.DIARY_NOT_BELONG_TO_USER);
        }

        mapper.updateDiaryFromRequest(request, userDiary);

        UserDiary updated = diaryRepository.save(userDiary);

        return mapper.toUpdateDiaryRes(updated);
    }

    @Override
    public UpdateItemRes updateItems(String diaryId,
                                     String itemId,
                                     UpdateItemsReq request) {

        UserDiary userDiary = findDiaryOrThrow(diaryId);

        UserDiaryItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.DIARY_ITEMS_NOT_FOUND));

        if (!item.getDiary().getId().equals(diaryId)) {
            throw new AccessDeniedException(ErrorCode.DIARY_ITEMS_NOT_FOUND.getMessage());
        }

        mapper.updateItemFromRequest(request, item);

        itemRepository.save(item);

        List<UserDiaryItem> allItems = itemRepository.findByDiaryId(diaryId);

        reCalculateUserDiary(userDiary, allItems);

        diaryRepository.save(userDiary);

        return mapper.toUpdateItemRes(item);
    }

    @Override
    public UpdateDiaryStatusRes updateDiaryStatus(String diaryId, UpdateDiaryStatusReq request) {

        UserDiary userDiary = findDiaryOrThrow(diaryId);

        userDiary.setDiaryStatus(request.getDiaryStatus());

        userDiary.setEndDate(LocalDateTime.now());

        diaryRepository.save(userDiary);

        return mapper.toUpdateDiaryStatusRes(userDiary);
    }


    @Override
    @Transactional
    public void deleteDiary(String userId, String id) {
        UserDiary userDiary = findDiaryOrThrow(id);

        if (!userDiary.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.DIARY_NOT_BELONG_TO_USER);
        }

        diaryRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteDiaryItem(String diaryId, String itemId) {

        itemRepository.findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.DIARY_ITEMS_NOT_FOUND));

        itemRepository.deleteById(itemId);

        UserDiary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new AppException(ErrorCode.DIARY_NOT_FOUND));

        List<UserDiaryItem> remainingItems = itemRepository.findByDiaryId(diaryId);

        reCalculateUserDiary(diary, remainingItems);

        diaryRepository.save(diary);

    }

}
