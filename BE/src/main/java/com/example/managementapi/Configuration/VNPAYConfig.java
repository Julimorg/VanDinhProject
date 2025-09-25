package com.example.managementapi.Configuration;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Component
public class VNPAYConfig {

    /*
    ! KHÔNG ĐƯỢC EDIT - XÓA  HAY CONFIG BẤT KÌ ĐOẠN CODE NÀO TRONG ĐÂY
    ! VÌ ĐÂY LÀ NHỮNG METHOD - ATTRIBUTES ĐÃ ĐƯỢC CONFIG DEFAULT SẴN
    ! */

    @NonFinal
    @Getter
    @Value("${vnp.secretkey}")
    private static String SECRET_KEY;

    @NonFinal
    @Getter
    @Value("${vnp.tmncode}")
    private static String TMN_CODE;

    @NonFinal
    @Getter
    @Value("${spring.vnp.version}")
    private static String VERSION;

    @NonFinal
    @Getter
    @Value("${spring.vnp.command}")
    private static String COMMAND;

    public static String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static String vnp_Returnurl = "http://localhost:8080/api/v1/vn-pay/vnpay-return";
    public static String vnp_TmnCode = "OA83P8FJ";
    public static String vnp_HashSecret = "YIZ2A00IFOEXME2O5RI75LP1GR0T4SX0";
    public static String vnp_Version = "2.1.0";
    public static String vnp_Command = "pay";
    public static String vnp_apiUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";

    //? Sử dụng thuật toán Md5 để mã hóa message
    public static String md5(String message) {
        String digest = null;
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest(message.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                sb.append(String.format("%02x", b & 0xff));
            }
            digest = sb.toString();
        } catch (UnsupportedEncodingException ex) {
            digest = "";
        } catch (NoSuchAlgorithmException ex) {
            digest = "";
        }
        return digest;
    }

    //? Sử dụng thuật toán Sha256 để mã hóa message
    public static String Sha256(String message) {
        String digest = null;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(message.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                sb.append(String.format("%02x", b & 0xff));
            }
            digest = sb.toString();
        } catch (UnsupportedEncodingException ex) {
            digest = "";
        } catch (NoSuchAlgorithmException ex) {
            digest = "";
        }
        return digest;
    }

    //? Method Quan trọng dùng để tạo Signature ( SecureHash ) khi gọi sang VnPay

    /*
    * Quy Trình của Method
    * Lấy tất cả key trong fields (map chứa các tham số gửi VNPay).
    * Sort (sắp xếp theo alphabet) danh sách key.
    * Ghép lại thành 1 chuỗi dạng key1=value1&key2=value2....
    * Dùng hmacSHA512 để tạo chữ ký bảo mật với vnp_HashSecret.
    * */

    public static String hashAllFields(Map fields) {
        List fieldNames = new ArrayList(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                sb.append(fieldName);
                sb.append("=");
                sb.append(fieldValue);
            }
            if (itr.hasNext()) {
                sb.append("&");
            }
        }
        return hmacSHA512(vnp_HashSecret,sb.toString());
    }

    //? Method tạo Signature bằng thuật toán HMAC-SHA512.
    public static String hmacSHA512(final String key, final String data) {
        try {

            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes();
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();

        } catch (Exception ex) {
            return "";
        }
    }

    //? Lấy IpAddress của Client khi request
    public static String getIpAddress(HttpServletRequest request) {
        String ipAdress;
        try {
            ipAdress = request.getHeader("X-FORWARDED-FOR");
            if (ipAdress == null) {
                ipAdress = request.getLocalAddr();
            }
        } catch (Exception e) {
            ipAdress = "Invalid IP:" + e.getMessage();
        }
        return ipAdress;
    }

    //? Tạo random transacion khi request
    public static String getRandomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
