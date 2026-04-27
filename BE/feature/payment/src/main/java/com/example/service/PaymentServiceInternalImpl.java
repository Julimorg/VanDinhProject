package com.example.service;

import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.payment.PaymentInternalService;
import com.example.persistence.entity.Payment;
import com.example.persistence.enumTable.PaymentMethod;
import com.example.persistence.enumTable.PaymentMethodStatus;
import com.example.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceInternalImpl implements PaymentInternalService {

    private final PaymentRepository  paymentRepository;

    @Override
    public void savePaymentData(Payment payment) {
        paymentRepository.save(payment);
    }

    @Override
    public void updatePaymentStatus(String orderId,
                                    PaymentMethodStatus status) {

        Payment payment = paymentRepository
                .findByOrder_id(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        payment.setPaymentStatus(status);

        paymentRepository.save(payment);

    }

    @Override
    public void updatePaymentMethod(String orderId,
                                    PaymentMethod method,
                                    PaymentMethodStatus status) {

        Payment payment = paymentRepository
                .findByOrder_id(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        payment.setPaymentMethod(method);

        payment.setPaymentStatus(status);

        paymentRepository.save(payment);

    }
}
