package com.example.managementapi.Service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.example.managementapi.Document.SearchAllDocument;
import com.example.managementapi.Dto.Response.ElasticSearch.SearchAllRes;
import com.example.managementapi.Entity.Category;
import com.example.managementapi.Entity.Product;
import com.example.managementapi.Entity.Supplier;
import com.example.managementapi.Events.ReindexEvent;
import com.example.managementapi.Mapper.ElasticSearchMapper;
import com.example.managementapi.Repository.CategoryRepository;
import com.example.managementapi.Repository.ProductRepository;
import com.example.managementapi.Repository.SearchAllDocumentRepository;
import com.example.managementapi.Repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class ElasticSearchService {
    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;

    private final SupplierRepository supplierRepository;

    private final SearchAllDocumentRepository searchAllDocumentRepository;

    private final ElasticsearchClient elasticsearchClient;

    private final ApplicationEventPublisher publisher;

    @Transactional
    public void reindexAsync() {
        publisher.publishEvent(new ReindexEvent.ReindexSearchAllEvent());
    }

    private SearchAllDocument mapCategory(Category category) {
        return SearchAllDocument.builder()
                .id("C_" + category.getCategoryId())
                .type("CATEGORY")
                .entityId(category.getCategoryId())
                .name(category.getCategoryName())
                .build();
    }

    public void saveCategory(Category category) {
        try {
            SearchAllDocument doc = mapCategory(category);

            elasticsearchClient.index(i -> i
                    .index("search_all")
                    .id(doc.getId())
                    .document(doc)
            );
        } catch (Exception e) {
            log.error("Save Category to ES failed", e);
        }
    }

    private SearchAllDocument mapSupplier(Supplier supplier) {
        return SearchAllDocument.builder()
                .id("S_" + supplier.getSupplierId())
                .type("SUPPLIER")
                .entityId(supplier.getSupplierId())
                .name(supplier.getSupplierName())
                .build();
    }

    public void saveSupplier(Supplier supplier) {
        try {
            SearchAllDocument doc = mapSupplier(supplier);

            elasticsearchClient.index(i -> i
                    .index("search_all")
                    .id(doc.getId())
                    .document(doc)
            );
        } catch (Exception e) {
            log.error("Save supplier to ES failed", e);
        }
    }

    private SearchAllDocument mapProduct(Product product) {
        String image = (product.getProductImage() != null && !product.getProductImage().isEmpty())
                ? product.getProductImage().getFirst()
                : "https://placehold.net/default.png";

        return SearchAllDocument.builder()
                .id("P_" + product.getProductId())
                .type("PRODUCT")
                .entityId(product.getProductId())
                .name(product.getProductName())
                .image(image)
                .build();
    }

    public void saveProduct(Product product) {
        try {
            SearchAllDocument doc = mapProduct(product);

            elasticsearchClient.index(i -> i
                    .index("search_all")
                    .id(doc.getId())
                    .document(doc)
            );
        } catch (Exception e) {
            log.error("Save Product to ES failed", e);
        }
    }

    public void delete(String id) {
        searchAllDocumentRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public void reindexAll() {
        log.info("Start reindex search_all index");

        List<SearchAllDocument> docs = new ArrayList<>();

        productRepository.findAll().forEach(p -> docs.add(mapProduct(p)));
        categoryRepository.findAll().forEach(c -> docs.add(mapCategory(c)));
        supplierRepository.findAll().forEach(s -> docs.add(mapSupplier(s)));

        try{
            elasticsearchClient.bulk(b -> {
                docs.forEach(doc ->
                        b.operations(op -> op
                                .index(idx -> idx
                                        .index("search_all")
                                        .id(doc.getId())
                                        .document(doc)
                                )
                        )
                );
                return b;
            });
            elasticsearchClient.indices().refresh(r -> r.index("search_all"));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        log.info("Finish reindex search_all index");
    }

    public Page<SearchAllRes> searchAll(String keyword, Pageable pageable) {
        try {

            SearchResponse<SearchAllDocument> response =
                    elasticsearchClient.search(s -> s
                                    .index("search_all")
                                    .from((int) pageable.getOffset())
                                    .size(pageable.getPageSize())
                                    .query(q -> q
                                            .multiMatch(m -> m
                                                    .query(keyword)
                                                    .fields("name")
                                                    .fuzziness("AUTO")
                                            )
                                    ),
                            SearchAllDocument.class
                    );

            List<SearchAllRes> content = response.hits().hits()
                    .stream()
                    .map(hit -> {
                        SearchAllDocument doc = hit.source();
                        if (doc == null) return null;

                        return SearchAllRes.builder()
                                .type(doc.getType())
                                .entityId(doc.getEntityId())
                                .name(doc.getName())
                                .score(hit.score() != null ? hit.score() : 0f)
                                .build();
                    })
                    .filter(Objects::nonNull)
                    .toList();

            long total = response.hits().total() != null
                    ? response.hits().total().value()
                    : content.size();

            return new PageImpl<>(content, pageable, total);

        } catch (Exception e) {
            log.error("ES search error", e);
            return Page.empty(pageable);
        }
    }

    //Tối ưu lại sau, tạo index riêng để read, write, cập nhật version index tránh downtime

}
