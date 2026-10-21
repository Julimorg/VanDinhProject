package com.example.persistence.enumTable;

public enum PaymentMethod {
    CASH,
    // QR chuyen khoan ngan hang thu cong (hien thi ma QR/so tai khoan, staff tu xac nhan da nhan tien).
    BANK_TRANSFER,
    // Cong thanh toan online - dang tam khong su dung cho USER (xem OrderService.confirmOrderByUser).
    VN_PAY,
    PAY_PAL
}
