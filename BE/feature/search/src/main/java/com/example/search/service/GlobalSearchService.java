package com.example.search.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.example.common.interfaces.category.CategoryInternalService;
import com.example.common.interfaces.products.ProductInternalService;
import com.example.common.interfaces.supplier.SupplierInternalService;
import com.example.search.document.GlobalSearchDocument;
import com.example.search.dto.response.GlobalSearchResult;
import com.example.search.event.ReindexEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class GlobalSearchService {

    private final ElasticsearchClient elasticsearchClient;
    private final GlobalSearchIndexService indexService;
    private final ApplicationEventPublisher publisher;
    private final ProductInternalService productInternalService;
    private final CategoryInternalService categoryInternalService;
    private final SupplierInternalService supplierInternalService;

    public void reindexAsync() {
        publisher.publishEvent(new ReindexEvent.ReindexAllEvent());
    }

    @Transactional(readOnly = true)
    public void reindexAll() {
        log.info("Start reindex global_search");

        List<GlobalSearchDocument> docs = new ArrayList<>();

        productInternalService.fetchProductsForIndex()
                .stream()
                .map(p -> GlobalSearchDocument.builder()
                        .id("P_" + p.getId())
                        .type("PRODUCT")
                        .entityId(p.getId())
                        .name(p.getName())
                        .image(p.getImage())
                        .price(p.getPrice())
                        .build())
                .forEach(docs::add);

        categoryInternalService.fetchCategoriesForIndex()
                .stream()
                .map(c -> GlobalSearchDocument.builder()
                        .id("C_" + c.getId())
                        .type("CATEGORY")
                        .entityId(c.getId())
                        .name(c.getName())
                        .image(c.getImage())
                        .price(null)
                        .build())
                .forEach(docs::add);

        supplierInternalService.fetchSuppliersForIndex()
                .stream()
                .map(s -> GlobalSearchDocument.builder()
                        .id("S_" + s.getId())
                        .type("SUPPLIER")
                        .entityId(s.getId())
                        .name(s.getName())
                        .image(s.getImage())
                        .price(null)
                        .build())
                .forEach(docs::add);

        indexService.bulkIndex(docs);

        try {
            elasticsearchClient.indices().refresh(r -> r.index("global_search"));
        } catch (Exception e) {
            log.error("Refresh index failed", e);
        }

        log.info("Finish reindex global_search");
    }

    public Page<GlobalSearchResult> search(String keyword, Pageable pageable) {
        try {
            SearchResponse<GlobalSearchDocument> response =
                    elasticsearchClient.search(s -> s
                                    .index("global_search")
                                    .from((int) pageable.getOffset())
                                    .size(pageable.getPageSize())
                                    .query(q -> q
                                            .bool(b -> b
                                                    .should(sh -> sh
                                                            .matchPhrasePrefix(m -> m
                                                                    .field("name")
                                                                    .query(keyword)
                                                            )
                                                    )
                                                    .should(sh -> sh
                                                            .multiMatch(m -> m
                                                                    .query(keyword)
                                                                    .fields("name")
                                                                    .fuzziness("AUTO")
                                                            )
                                                    )
                                                    .minimumShouldMatch("1")
                                            )
                                    ),
                            GlobalSearchDocument.class
                    );

            List<GlobalSearchResult> content = response.hits().hits()
                    .stream()
                    .map(hit -> {
                        GlobalSearchDocument doc = hit.source();
                        if (doc == null) return null;
                        return GlobalSearchResult.builder()
                                .type(doc.getType())
                                .entityId(doc.getEntityId())
                                .name(doc.getName())
                                .image(doc.getImage())
                                .price(doc.getPrice())
                                .score(hit.score() != null ? hit.score() : 0.0)
                                .build();
                    })
                    .filter(Objects::nonNull)
                    .toList();

            long total = response.hits().total() != null
                    ? response.hits().total().value()
                    : content.size();

            return new PageImpl<>(content, pageable, total);

        } catch (Exception e) {
            log.error("Global search failed: keyword={}", keyword, e);
            return Page.empty(pageable);
        }
    }
}