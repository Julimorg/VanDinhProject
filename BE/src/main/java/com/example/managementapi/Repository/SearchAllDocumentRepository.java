package com.example.managementapi.Repository;

import com.example.managementapi.Document.SearchAllDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface SearchAllDocumentRepository extends ElasticsearchRepository<SearchAllDocument, String>  {
}
