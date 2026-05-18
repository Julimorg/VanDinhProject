package com.example.persistence.entity;

import com.example.persistence.config.MapToJsonConverter;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "paint_detail", indexes = {
        @Index(name = "idx_surface_type", columnList = "surface_type"),
        @Index(name = "idx_column_list", columnList = "volume"),
        @Index(name = "idx_paint_color_id", columnList = "color_id")
})
public class PaintDetail {

    @Id
    private String productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    private Product product;

//    @Column(name = "finish_type")
//    private String finishType;

    @Column(name = "surface_type")
    private String surfaceType;

    @Column(name = "volume")
    private String volume;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "color_id")
    private Color color;

    @Column(name = "extra_specs", columnDefinition = "JSON")
    @Convert(converter = MapToJsonConverter.class)
    private Map<String, Object> extraSpecs = new HashMap<>();
}
