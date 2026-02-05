package com.example.managementapi.Controller;

import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Response.ElasticSearch.SearchAllRes;
import com.example.managementapi.Dto.Response.Product.GetProductsRes;
import com.example.managementapi.Service.ElasticSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/elasticsearch")
public class ElasticSearchController {
    private final ElasticSearchService elasticSearchService;

    @PostMapping("/reindex")
    public ApiResponse<String> reindexAll() {
        elasticSearchService.reindexAsync();

        return ApiResponse.<String>builder()

                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data("Reindex Successfully!")
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/search-all")
    public ApiResponse<Page<SearchAllRes>> searchAll(
            @PageableDefault(size = 10) Pageable pageable,
            @RequestParam(value = "keyword", required = false) String keyword){

        return ApiResponse.<Page<SearchAllRes>>builder()

                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(elasticSearchService.searchAll(keyword, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }

//    @GetMapping("/search-all-test")
//    public ApiResponse<List<SearchAllRes>> searchAll(
//            @RequestParam String keyword
//    ) {
//        return ApiResponse.<List<SearchAllRes>>builder()
//                .status_code(HttpStatus.OK.value())
//                .message(HttpStatus.OK.getReasonPhrase())
//                .data(elasticSearchService.searchAll(keyword))
//                .timestamp(LocalDateTime.now())
//                .build();
//    }
}
