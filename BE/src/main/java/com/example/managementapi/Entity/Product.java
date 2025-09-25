package com.example.managementapi.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String productId;
    private String productName;
    private String productDescription;

    @ElementCollection
    private List<String> productImage = new ArrayList<>();
    private String productVolume;
    private String productUnit;
    private String productCode;

    //Nếu test postman thì sẽ nhận thông báo Unknown Error, mặc dù trong service đã dùng custom error
    //Springboot sẽ bỏ qua thằng Exception custom và chỉ dùng của thằng @Max
    //@Max(10000000)
    private int productQuantity;

    private double discount;

    private BigDecimal productPrice;

    private LocalDateTime lastNotified;

    @CreationTimestamp
    private LocalDateTime createAt;
    @UpdateTimestamp
    private LocalDateTime updateAt;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier suppliers;

    @ManyToOne
    @JoinColumn(name = "color_id")
    private Color colors;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;


}
