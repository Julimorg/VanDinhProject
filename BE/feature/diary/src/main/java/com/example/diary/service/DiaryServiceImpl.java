package com.example.diary.service;

import com.example.common.dto.diary.request.CreateDiaryItemsReq;
import com.example.common.dto.diary.request.CreateDiaryReq;
import com.example.common.dto.diary.request.DiaryItemRequest;
import com.example.common.dto.diary.request.UpdateDiaryRequest;
import com.example.common.dto.diary.response.CreateDiaryItemsRes;
import com.example.common.dto.diary.response.CreateDiaryRes;
import com.example.common.dto.diary.response.GetDiaryDetailRes;
import com.example.common.dto.diary.response.GetDiaryRes;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.diary.DiaryService;
import com.example.common.interfaces.user.UserInternalService;
import com.example.diary.config.DiarySpecification;
import com.example.diary.mapper.DiaryMapper;
import com.example.diary.repository.UserDiaryItemRepository;
import com.example.diary.repository.UserDiaryRepository;
import com.example.persistence.entity.PurchaseOrder;
import com.example.persistence.entity.PurchaseOrderItem;
import com.example.persistence.entity.UserDiary;
import com.example.persistence.entity.UserDiaryItem;
import com.example.persistence.enumTable.DiaryStatus;
import com.example.security.Util.UtilSecurityClass;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
            String keyword,
            String fromDate,
            String toDate,
            Pageable pageable
    ) {
        Specification<UserDiary> spec = DiarySpecification.from(
                DiarySpecification.DiaryFilter.of(keyword, fromDate, toDate)
        );
        return diaryRepository
                .findAll(spec, pageable)
                .map(mapper::toGetDiary);
    }

    @Override
    public GetDiaryDetailRes getDiaryDetail (String id) {
        UserDiary diary = findDiaryOrThrow(id);
        return mapper.toGetDiaryDetail(diary);
    }


    @Transactional
    @Override
    public CreateDiaryRes createDiary(CreateDiaryReq request) {

        UserDiary diary = UserDiary.builder()
                .diaryName(request.getDiaryName())
                .diaryStatus(DiaryStatus.UNPAID)
                .note(request.getNote())
                .createdBy(UtilSecurityClass.getCurrentUsername())
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
    public CreateDiaryRes updateDiary(String id, UpdateDiaryRequest request) {
//        UserDiary diary = findDiaryOrThrow(id);
//
//        mapper.updateDiaryFromRequest(request, diary);
//
//        if (request.items() != null && !request.items().isEmpty()) {
//            itemRepository.deleteByDiaryId(diary.getId());
//            List<UserDiaryItem> items = buildItems(diary, request.items());
//            itemRepository.saveAll(items);
//            diary.setTotalAmount(calcTotal(items));
//            diary = diaryRepository.save(diary);
//            log.info("=== DIARY UPDATED: id={}", diary.getId());
//            return buildDiaryResponse(diary, items);
//        }
//
//        diary = diaryRepository.save(diary);
//        List<UserDiaryItem> items = itemRepository.findByDiaryId(diary.getId());
//        log.info("=== DIARY UPDATED: id={}", diary.getId());
//        return buildDiaryResponse(diary, items);

        return null;
    }

    @Override
    @Transactional
    public void deleteDiary(String id) {
        findDiaryOrThrow(id);
        itemRepository.deleteByDiaryId(id);
        diaryRepository.deleteById(id);
    }

    @Override
    public void deleteDiaryItem(String diaryId, String itemId) {

    }

}
