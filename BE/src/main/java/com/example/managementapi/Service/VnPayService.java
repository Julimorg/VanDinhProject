package com.example.managementapi.Service;


import com.example.managementapi.Configuration.VNPAYConfig;
import com.example.managementapi.Entity.Order;
import com.example.managementapi.Entity.Payment;
import com.example.managementapi.Enum.OrderStatus;
import com.example.managementapi.Enum.PaymentMethodStatus;
import com.example.managementapi.Repository.OrderRepository;
import com.example.managementapi.Repository.PaymentRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;


@Service
@Slf4j
@RequiredArgsConstructor
public class VnPayService {

    private final OrderRepository orderRepository;

    private final PaymentRepository paymentRepository;

    private final VNPAYConfig vnPayConfig;

    @Transactional
    public String createOrder(HttpServletRequest request, String orderId) throws UnsupportedEncodingException {

        log.info("Creating NEW payment URL for order: {}", orderId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = order.getPayment();

        if (payment.getPaymentStatus() == PaymentMethodStatus.Paid) {
            throw new RuntimeException("Order already paid");
        }

        BigDecimal amount = order.getOrderAmount();
        BigDecimal vnpAmount = amount.multiply(BigDecimal.valueOf(100));

        String vnp_IpAddr = VNPAYConfig.getIpAddress(request);
        String vnp_TmnCode = VNPAYConfig.vnp_TmnCode;
        String vnp_Version = VNPAYConfig.vnp_Version;
        String vnp_Command = VNPAYConfig.vnp_Command;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", vnpAmount.toBigInteger().toString());
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_BankCode", "NCB");
        vnp_Params.put("vnp_Locale", "vn");

        String txnRef = orderId + "_" + System.currentTimeMillis();
        vnp_Params.put("vnp_TxnRef", txnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang " + orderId);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_ReturnUrl", VNPAYConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        // ✅ FIX: Dùng Etc/GMT+7 hoặc thêm 7 giờ vào UTC
        // Cách 1: Dùng TimeZone.getTimeZone("Etc/GMT+7") - Đảo ngược
        // Cách 2: Lấy thời gian hiện tại của VN theo cách khác

        // ✅ Cách an toàn nhất
        ZonedDateTime nowVN = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        String vnp_CreateDate = nowVN.format(formatter);
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        ZonedDateTime expireVN = nowVN.plusMinutes(15);
        String vnp_ExpireDate = expireVN.format(formatter);
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

// Log để kiểm tra
        log.info("Vietnam Time: {}", nowVN);
        log.info("CreateDate: {}", vnp_CreateDate);
        log.info("ExpireDate: {}", vnp_ExpireDate);

        // ✅ Log chi tiết để debug
        log.info("System current millis: {}", System.currentTimeMillis());
//        log.info("Calendar time: {}", cld.getTime());
        log.info("Timezone ID: {}", TimeZone.getTimeZone("GMT+7").getID());
        log.info("Timezone offset: {} hours", TimeZone.getTimeZone("GMT+7").getRawOffset() / 3600000);
        log.info("Creating VNPAY order - OrderID: {}, Amount: {}, CreateDate: {}, ExpireDate: {}",
                orderId, vnpAmount, vnp_CreateDate, vnp_ExpireDate);
        log.info("=== VNPAY Payment Request ===");
        log.info("OrderID: {}", orderId);
        log.info("Amount: {}", amount);
        log.info("TxnRef: {}", txnRef);
        log.info("CreateDate: {}", vnp_CreateDate);
        log.info("ExpireDate: {}", vnp_ExpireDate);
        log.info("Current Server Time: {}", LocalDateTime.now());
        log.info("============================");

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = VNPAYConfig.hmacSHA512(VNPAYConfig.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        String paymentUrl = VNPAYConfig.vnp_PayUrl + "?" + queryUrl;
        log.info("VNPAY Payment URL: {}", paymentUrl);

        return paymentUrl;
    }

    public Map<String, String> handleReturn(HttpServletRequest request) {
        Map<String, String> result = new HashMap<>();
        Map<String, String> fields = new HashMap<>();

        request.getParameterMap().forEach((k, v) -> fields.put(k, v[0]));

        String vnp_SecureHash = fields.remove("vnp_SecureHash");
        String signValue = VNPAYConfig.hashAllFields(fields);

        result.put("orderId", fields.get("vnp_TxnRef"));
        result.put("amount", new BigDecimal(fields.get("vnp_Amount"))
                .divide(BigDecimal.valueOf(100)).toPlainString());
        result.put("transactionNo", fields.get("vnp_TransactionNo"));
        result.put("bankCode", fields.get("vnp_BankCode"));

        if (signValue.equals(vnp_SecureHash)) {
            if ("00".equals(fields.get("vnp_ResponseCode"))) {
                result.put("success", "true");
                result.put("message", "Thanh toán thành công! Đơn hàng đang được xử lý...");
            } else {
                result.put("success", "false");
                result.put("message", "Thanh toán thất bại (mã: " + fields.get("vnp_ResponseCode") + ")");
            }
        } else {
            result.put("success", "false");
            result.put("message", "Chữ ký không hợp lệ – Có thể bị giả mạo!");
        }
        return result;
    }

    @Transactional
    public Map<String, String> handleIpn(Map<String, String> fields) {
        Map<String, String> resp = new HashMap<>();
        resp.put("RspCode", "99");
        resp.put("Message", "Unknown error");

        String vnp_SecureHash = fields.remove("vnp_SecureHash");
        if (vnp_SecureHash == null) {
            resp.put("RspCode", "97");
            resp.put("Message", "Invalid signature");
            return resp;
        }

        String signValue = VNPAYConfig.hashAllFields(fields);
        if (!signValue.equals(vnp_SecureHash)) {
            log.warn("IPN: Chữ ký không hợp lệ! Có thể bị fake.");
            resp.put("RspCode", "97");
            resp.put("Message", "Invalid signature");
            return resp;
        }

        String orderId = fields.get("vnp_TxnRef");
        String vnpAmountStr = fields.get("vnp_Amount");
        String responseCode = fields.get("vnp_ResponseCode");
        String transactionNo = fields.get("vnp_TransactionNo");

        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            resp.put("RspCode", "01");
            resp.put("Message", "Order not found");
            return resp;
        }

        Payment payment = order.getPayment();

        //? Kiểm tra số tiền
        BigDecimal vnpAmount = new BigDecimal(vnpAmountStr).divide(BigDecimal.valueOf(100));
        if (vnpAmount.compareTo(order.getOrderAmount()) != 0) {
            log.warn("IPN: Số tiền không khớp! Order: {} | VNPAY: {}", order.getOrderAmount(), vnpAmount);
            resp.put("RspCode", "04");
            resp.put("Message", "Invalid amount");
            return resp;
        }

        //? Tránh xử lý 2 lần (idempotent)
        if (payment.getPaymentStatus() == PaymentMethodStatus.Paid) {
            log.info("IPN: Đơn hàng {} đã được xác nhận trước đó", orderId);
            resp.put("RspCode", "02");
            resp.put("Message", "Order already confirmed");
            return resp;
        }

        if ("00".equals(responseCode)) {
            //? THANH TOÁN THÀNH CÔNG → CẬP NHẬT DB
            payment.setPaymentStatus(PaymentMethodStatus.Paid);
            payment.setBankTransactionNo(transactionNo);
            payment.setPaidAt(LocalDateTime.now());
            order.setUpdateAt(LocalDateTime.now());

            paymentRepository.save(payment);
            orderRepository.save(order);

            log.info("IPN: Thanh toán THÀNH CÔNG đơn hàng {} – TransactionNo: {}", orderId, transactionNo);

            resp.put("RspCode", "00");
            resp.put("Message", "Confirm Success");
        } else {
            payment.setPaymentStatus(PaymentMethodStatus.Failed);
            paymentRepository.save(payment);

            log.warn("IPN: Thanh toán THẤT BẠI đơn {} – ResponseCode: {}", orderId, responseCode);
            resp.put("RspCode", "01");
            resp.put("Message", "Payment Failed");
        }

        return resp;
    }

    public int orderReturn(HttpServletRequest request){
        Map fields = new HashMap();
        for (Enumeration params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = null;
            String fieldValue = null;
            try {
                fieldName = URLEncoder.encode((String) params.nextElement(), StandardCharsets.US_ASCII.toString());
                fieldValue = URLEncoder.encode(request.getParameter(fieldName), StandardCharsets.US_ASCII.toString());
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType")) {
            fields.remove("vnp_SecureHashType");
        }
        if (fields.containsKey("vnp_SecureHash")) {
            fields.remove("vnp_SecureHash");
        }
        String signValue = VNPAYConfig.hashAllFields(fields);

        String transactionStatus = request.getParameter("vnp_TransactionStatus");
        String responseCode = request.getParameter("vnp_ResponseCode");
        System.out.println("TranSaction Status:" +transactionStatus);
        System.out.println("Response Code:" +responseCode);

        if(!signValue.equals(vnp_SecureHash)){
            return -1;
        }

        switch (transactionStatus){
            case "00":
                return 1;
            case "01":
                return 2;
            case "02":
                return 3;
            case "04":
                return 4;
            case "05":
                return 5;
            case "06":
                return 6;
            case "07":
                return 7;
            case "09":
                return 8;
            default:
                return 0;
        }

//        if (signValue.equals(vnp_SecureHash)) {
//            if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {
//                return 1;
//            } else {
//                return 0;
//            }
//        } else {
//            return -1;
//        }
    }
}

