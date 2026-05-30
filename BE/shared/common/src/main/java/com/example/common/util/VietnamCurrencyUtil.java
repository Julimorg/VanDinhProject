package com.example.common.util;

import java.math.BigDecimal;

public class VietnamCurrencyUtil {

    private static final String[] UNITS = {
            "", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"
    };
    private static final String[] GROUPS = { "", "nghìn", "triệu", "tỷ" };

    public static String toWords(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) == 0) return "Không đồng";
        long value = amount.longValue();
        return capitalize(convertNumber(value).trim()) + " đồng";
    }

    private static String convertNumber(long number) {
        if (number == 0) return "không";
        StringBuilder sb = new StringBuilder();
        int groupIndex = 0;
        while (number > 0) {
            int group = (int) (number % 1000);
            if (group != 0) {
                String groupStr = convertGroup(group);
                if (groupIndex > 0) sb.insert(0, GROUPS[groupIndex] + " ");
                sb.insert(0, groupStr + " ");
            }
            number /= 1000;
            groupIndex++;
        }
        return sb.toString().trim();
    }

    private static String convertGroup(int number) {
        StringBuilder sb = new StringBuilder();
        int hundreds = number / 100;
        int tens     = (number % 100) / 10;
        int units    = number % 10;

        if (hundreds > 0) {
            sb.append(UNITS[hundreds]).append(" trăm ");
            if (tens == 0 && units > 0) sb.append("lẻ ");
        }
        if (tens > 1) {
            sb.append(UNITS[tens]).append(" mươi ");
            if (units == 1)     sb.append("mốt ");
            else if (units > 0) sb.append(UNITS[units]).append(" ");
        } else if (tens == 1) {
            sb.append("mười ");
            if (units > 0) sb.append(UNITS[units]).append(" ");
        } else if (units > 0) {
            sb.append(UNITS[units]).append(" ");
        }
        return sb.toString().trim();
    }

    private static String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }
}