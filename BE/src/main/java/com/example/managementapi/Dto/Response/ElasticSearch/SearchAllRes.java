package com.example.managementapi.Dto.Response.ElasticSearch;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchAllRes {
    private String type;
    private String entityId;
    private String name;
    private double score;
}
