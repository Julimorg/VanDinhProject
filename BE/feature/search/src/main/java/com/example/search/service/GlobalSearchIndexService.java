package com.example.search.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import com.example.common.events.search.SearchIndexEvent;
import com.example.search.document.GlobalSearchDocument;
import com.example.search.repository.GlobalSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GlobalSearchIndexService {

    private final GlobalSearchRepository globalSearchRepository;
    private final ElasticsearchClient elasticsearchClient;

    public void index(SearchIndexEvent event) {
        try {
            GlobalSearchDocument doc = GlobalSearchDocument.builder()
                    .id(event.getId())
                    .type(event.getType())
                    .entityId(event.getEntityId())
                    .name(event.getName())
                    .image(event.getImage())
                    .price(event.getPrice())
                    .build();

            elasticsearchClient.index(i -> i
                    .index("global_search")
                    .id(doc.getId())
                    .document(doc)
            );
        } catch (Exception e) {
            log.error("Index document failed: id={}", event.getId(), e);
        }
    }

    public void delete(String id) {
        try {
            globalSearchRepository.deleteById(id);
        } catch (Exception e) {
            log.error("Delete document failed: id={}", id, e);
        }
    }

    public void bulkIndex(List<GlobalSearchDocument> docs) {
        try {
            elasticsearchClient.bulk(b -> {
                docs.forEach(doc ->
                        b.operations(op -> op
                                .index(idx -> idx
                                        .index("global_search")
                                        .id(doc.getId())
                                        .document(doc)
                                )
                        )
                );
                return b;
            });
        } catch (Exception e) {
            log.error("Bulk index failed", e);
        }
    }
}