package com.example.managementapi.Document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

//@JsonIgnoreProperties(ignoreUnknown = true)

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "search_all")
@JsonIgnoreProperties({ "_class" })
public class SearchAllDocument {
    @Id
    private String id;

    @Field(type = FieldType.Keyword)
    private String type;

    @Field(type = FieldType.Keyword)
    private String entityId;

    @Field(type = FieldType.Text)
    private String name;

    @Field(type = FieldType.Keyword, index = false)
    private String image;
}
