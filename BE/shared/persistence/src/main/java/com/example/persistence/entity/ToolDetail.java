package com.example.persistence.entity;

import com.example.persistence.config.MapToJsonConverter;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tool_detail")
public class ToolDetail {

    @Id
    private String productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "tool_type")
    private String toolType;

    @Column(name = "size")
    private String size;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "JSON")
    @Convert(converter = MapToJsonConverter.class)
    private Map<String, Object> extraSpecs = new HashMap<>();


}
