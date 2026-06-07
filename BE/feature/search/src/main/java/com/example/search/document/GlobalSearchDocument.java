// package com.example.search.document;

// import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
// import lombok.*;
// import org.springframework.data.annotation.Id;
// import org.springframework.data.elasticsearch.annotations.Document;
// import org.springframework.data.elasticsearch.annotations.Field;
// import org.springframework.data.elasticsearch.annotations.FieldType;
// import java.math.BigDecimal;

// @Getter
// @Setter
// @Builder
// @NoArgsConstructor
// @AllArgsConstructor
// @Document(indexName = "global_search")
// @JsonIgnoreProperties({ "_class" })
// public class GlobalSearchDocument {

//     @Id
//     private String id;

//     @Field(type = FieldType.Keyword)
//     private String type;

//     @Field(type = FieldType.Keyword)
//     private String entityId;

//     @Field(type = FieldType.Text)
//     private String name;

//     @Field(type = FieldType.Double)
//     private BigDecimal price;

//     @Field(type = FieldType.Keyword, index = false)
//     private String image;
// }