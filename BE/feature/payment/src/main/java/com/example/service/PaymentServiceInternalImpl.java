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

import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceInternalImpl implements PaymentInternalService {

    private final PaymentRepository  paymentRepository;

    // Paid/Canceled la trang thai cuoi (terminal) - khong duoc phep chuyen sang trang thai khac nua,
    // de tranh vi du: don da Canceled bi danh dau lai thanh Paid, hoac Paid bi revert ve Pending.
    private static final Set<PaymentMethodStatus> TERMINAL_STATUSES =
            Set.of(PaymentMethodStatus.Paid, PaymentMethodStatus.Canceled);

    private void validateTransition(PaymentMethodStatus current, PaymentMethodStatus next) {
        if (current == next) {
            return; // idempotent, khong lam gi them
        }
        if (TERMINAL_STATUSES.contains(current)) {
            throw new AppException(ErrorCode.INVALID_PAYMENT_STATUS_TRANSITION);
        }
    }

    @Override
    public void savePaymentData(Payment payment) {
        paymentRepository.save(payment);
    }

    @Override
    public void updatePaymentStatus(String orderId,
                                    PaymentMethodStatus status) {

        Payment payment = paymentRepository
                .findByOrder_OrderId(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        validateTransition(payment.getPaymentStatus(), status);

        if (payment.getPaymentStatus() == status) {
            return;
        }

        payment.setPaymentStatus(status);

        paymentRepository.save(payment);

    }

    @Override
    public void updatePaymentMethod(String orderId,
                                    PaymentMethod method,
                                    PaymentMethodStatus status) {

        Payment payment = paymentRepository
                .findByOrder_OrderId(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        validateTransition(payment.getPaymentStatus(), status);

        payment.setPaymentMethod(method);
        payment.setPaymentStatus(status);

        paymentRepository.save(payment);

    }
}
