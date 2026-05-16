package com.example.search.controller;

import com.example.common.response.ApiResponse;
import com.example.search.dto.response.GlobalSearchResult;
import com.example.search.service.GlobalSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/search")
public class GlobalSearchController {

    private final GlobalSearchService globalSearchService;

    @PostMapping("/reindex")
    public ApiResponse<String> reindex() {
        globalSearchService.reindexAsync();
        return ApiResponse.<String>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data("Reindex triggered successfully")
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/global")
    public ApiResponse<Page<GlobalSearchResult>> search(
            @PageableDefault(size = 10) Pageable pageable,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.<Page<GlobalSearchResult>>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(globalSearchService.search(keyword, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }
}