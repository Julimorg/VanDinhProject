package com.example.managementapi.Dto.Response.VnPay;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRes implements Serializable {
     private String status;
     private String message;
     private String url;
}
