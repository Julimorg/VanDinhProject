package com.example.managementapi.Dto.Response.ElasticSearch;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchAllRes {
    private String type;
    private String entityId;
    private String name;
    private String image;
    private BigDecimal price;
    private double score;

}
