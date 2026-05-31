package com.example.diary.service;

import com.example.common.dto.diary.request.CreateDiaryRequest;
import com.example.common.dto.diary.request.DiaryItemRequest;
import com.example.common.dto.diary.request.UpdateDiaryRequest;
import com.example.common.dto.diary.response.DiaryResponse;
import com.example.common.dto.diary.response.DiarySummaryResponse;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.user.UserInternalService;
import com.example.diary.config.DiarySpecification;
import com.example.diary.mapper.DiaryMapper;
import com.example.diary.repository.UserDiaryItemRepository;
import com.example.diary.repository.UserDiaryRepository;
import com.example.persistence.entity.UserDiary;
import com.example.persistence.entity.UserDiaryItem;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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

    // ── lấy username từ JWT ───────────────────────────────────────
    private String getCurrentUsername() {
        Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();
        String userId = "";
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            userId = jwt.getAudience().getFirst();
        }
        String userName = userInternalService
            .getUserNameById(userId)
            .getUserName();
        log.info("=== USER ID: {}", userId);
        log.info("=== USER NAME: {}", userName);
        return userName;
    }

    // ── build items + tính subtotal ───────────────────────────────
    private List<UserDiaryItem> buildItems(
        UserDiary diary,
        List<DiaryItemRequest> requests
    ) {
        return requests
            .stream()
            .map(req ->
                UserDiaryItem.builder()
                    .diary(diary)
                    .productId(req.productId())
                    .productName(req.productName())
                    .quantity(req.quantity())
                    .unitPrice(req.unitPrice())
                    .subtotal(req.quantity().multiply(req.unitPrice()))
                    .itemNote(req.itemNote())
                    .build()
            )
            .toList();
    }

    // ── tính total ────────────────────────────────────────────────
    private BigDecimal calcTotal(List<UserDiaryItem> items) {
        return items
            .stream()
            .map(UserDiaryItem::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // ── assemble full response ────────────────────────────────────
    private DiaryResponse buildDiaryResponse(
        UserDiary diary,
        List<UserDiaryItem> items
    ) {
        DiaryResponse response = mapper.toResponse(diary);
        response.setItems(mapper.toItemResponseList(items));
        return response;
    }

    // ── CREATE DIARY ──────────────────────────────────────────────
    @Override
    @Transactional
    public DiaryResponse createDiary(CreateDiaryRequest request) {
        UserDiary diary = UserDiary.builder()
            .diaryDate(request.diaryDate())
            .note(request.note())
            .createdBy(getCurrentUsername())
            .build();

        diary = diaryRepository.save(diary);

        List<UserDiaryItem> items = buildItems(diary, request.items());
        itemRepository.saveAll(items);

        diary.setTotalAmount(calcTotal(items));
        diary = diaryRepository.save(diary);

        log.info(
            "=== DIARY CREATED: id={}, createdBy={}",
            diary.getId(),
            diary.getCreatedBy()
        );
        return buildDiaryResponse(diary, items);
    }

    // ── GET DIARIES ───────────────────────────────────────────────
    @Override
    public Page<DiarySummaryResponse> getDiaries(
        String keyword,
        LocalDate fromDate,
        LocalDate toDate,
        Pageable pageable
    ) {
        Specification<UserDiary> spec = DiarySpecification.from(
            DiarySpecification.DiaryFilter.of(keyword, fromDate, toDate)
        );
        return diaryRepository
            .findAll(spec, pageable)
            .map(mapper::toSummaryResponse);
    }

    // ── GET DIARY ─────────────────────────────────────────────────
    @Override
    public DiaryResponse getDiary(String id) {
        UserDiary diary = findDiaryOrThrow(id);
        List<UserDiaryItem> items = itemRepository.findByDiaryId(diary.getId());
        return buildDiaryResponse(diary, items);
    }

    // ── UPDATE DIARY ──────────────────────────────────────────────
    @Override
    @Transactional
    public DiaryResponse updateDiary(String id, UpdateDiaryRequest request) {
        UserDiary diary = findDiaryOrThrow(id);

        mapper.updateDiaryFromRequest(request, diary);

        if (request.items() != null && !request.items().isEmpty()) {
            itemRepository.deleteByDiaryId(diary.getId());
            List<UserDiaryItem> items = buildItems(diary, request.items());
            itemRepository.saveAll(items);
            diary.setTotalAmount(calcTotal(items));
            diary = diaryRepository.save(diary);
            log.info("=== DIARY UPDATED: id={}", diary.getId());
            return buildDiaryResponse(diary, items);
        }

        diary = diaryRepository.save(diary);
        List<UserDiaryItem> items = itemRepository.findByDiaryId(diary.getId());
        log.info("=== DIARY UPDATED: id={}", diary.getId());
        return buildDiaryResponse(diary, items);
    }

    // ── DELETE DIARY ──────────────────────────────────────────────
    @Override
    @Transactional
    public void deleteDiary(String id) {
        findDiaryOrThrow(id);
        itemRepository.deleteByDiaryId(id);
        diaryRepository.deleteById(id);
        log.info("=== DIARY DELETED: id={}", id);
    }

    // ── helper ────────────────────────────────────────────────────
    private UserDiary findDiaryOrThrow(String id) {
        return diaryRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.DIARY_NOT_FOUND));
    }
}
