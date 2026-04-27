package com.example.common.interfaces.payment;

import com.example.persistence.entity.Payment;
import com.example.persistence.enumTable.PaymentMethod;
import com.example.persistence.enumTable.PaymentMethodStatus;

public interface PaymentInternalService {

    void savePaymentData(Payment payment);

    void updatePaymentStatus(String orderId,
                             PaymentMethodStatus status);

    void updatePaymentMethod(String orderId,
                             PaymentMethod method,
                             PaymentMethodStatus status);
}
