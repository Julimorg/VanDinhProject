package com.example.search.repository;

import com.example.search.document.GlobalSearchDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface GlobalSearchRepository extends ElasticsearchRepository<GlobalSearchDocument, String> {
}