package com.example.managementapi.Configuration;
import jakarta.servlet.http.HttpServletRequest;
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


    @Value("${vnp.secretkey}")
    public void secretKey(String secretKey) {
        VNPAYConfig.vnp_HashSecret = secretKey;
    }

    @Value("${vnp.tmncode}")
    public void tmnCode(String tmnCode) {
        VNPAYConfig.vnp_TmnCode = tmnCode;
    }

    @Value("${vnp.urlDevTest}")
    public void urlDevTest(String urlDevTest) {
        VNPAYConfig.vnp_PayUrl = urlDevTest;
    }

    @Value("${vnp.returnUrl}")
    public void returnUrl(String returnUrl) {
        VNPAYConfig.vnp_ReturnUrl = returnUrl;
    }

    @Value("${vnp.version}")
    public void version(String version) {
        VNPAYConfig.vnp_Version = version;
    }

    @Value("${vnp.command}")
    public void command(String command) {
        VNPAYConfig.vnp_Command = command;
    }

    @Value("${vnp.apiUrl}")
    public void apiUrl(String apiUrl) {
        VNPAYConfig.vnp_apiUrl = apiUrl;
    }


    public static String vnp_PayUrl;
    public static String vnp_ReturnUrl;
    public static String vnp_TmnCode ;
    public static String vnp_HashSecret;
    public static String vnp_Version;
    public static String vnp_Command;
    public static String vnp_apiUrl;

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