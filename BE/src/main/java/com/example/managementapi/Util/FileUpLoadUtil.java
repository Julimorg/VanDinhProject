package com.example.managementapi.Util;

import com.example.managementapi.Enum.ErrorCode;
import com.example.managementapi.Exception.AppException;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.web.multipart.MultipartFile;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@UtilityClass
@Slf4j
public class FileUpLoadUtil {

    //? Check size của File --> MAX = 2MB
    public static final long MAX_FILE_SIZE = 2 * 1024 * 1024;


    //? Check định dạng file img theo kiểu pattern regex
    //? Có 2 kiểu check
    //?  (?i)^(jpg|jpeg|png|gif|bmp|webp)$  --> Ko quan tâm đến tên file ( chỉ kiểu tra các đuôi file jpg, jpeg, ...)
    //?  ([^\\s]+(\\.(?i)(jpg|jpeg|png|gif|bmp|webp))$) --> kiểm tra toàn bộ từ tên file ( ko có khoảng trắng ) đến đuôi file
    public static final String IMAGE_PATTERN = "(?i)^(jpg|jpeg|png|gif|bmp|webp)$";

    public static final String DATE_FORMAT = "yyyy-MM-dd";

    //? Config tên file / %s_%s --> IMG_2025-03-12
    public static final String FILE_NAME_FORMAT = "%s_%s";


    //? Function check phần mở rộng file có valid không
    public static boolean isAllowedExtension(final String extension, final String pattern) {
        if (extension == null) {
            return false;
        }
        //? Compile dạng Regex với Pattern và không biệt hoa / thường
        //? Loại bỏ khoảng trắng thông qua trim
        final Matcher matcher = Pattern.compile(pattern, Pattern.CASE_INSENSITIVE).matcher(extension.trim());

        //? Check extension khớp với pattern hay không
        boolean matches = matcher.matches();
        return matches;
    }

    //? Function check MultipartFile có Valid không
    public static void assertAllowed(MultipartFile file, String pattern){

        //? lấy kích thước của file
        final long size = file.getSize();
        //? lấy tên file gốc
        final String fileName = file.getOriginalFilename();

        //? Lấy đuôi file --> Hello.png
        //?         ví dụ --> final String extension = png
        final String extension = FilenameUtils.getExtension(fileName);

        if (size > MAX_FILE_SIZE) {
            throw new AppException(ErrorCode.IMG_OVER_SIZE);
        }

        if (fileName == null || fileName.isEmpty()) {
            throw new RuntimeException("File name cannot be null or empty");
        }

        if (!isAllowedExtension(extension, pattern)) {
            throw new RuntimeException("Only jpg, png, gif, bmp, webp files are allowed");
        }

    }

    //? Generate ra tên file dựa trên các data được truyền vào
    public static String getFileName(final String name) {

        //? Generate DATE theo yyyy-MM-dd
        final DateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);

        //? Lấy DATE hiện tại
        final String date = dateFormat.format(System.currentTimeMillis());

        //? Clean tên file, thay cho các ký tự không hợp lệ bằng dấu "_"
        String cleanName = name.replaceAll("[^a-zA-Z0-9_-]", "_");

        //? return về tên file theo format -> yello_2025-08-23
        return String.format(FILE_NAME_FORMAT, cleanName, date);

    }
}
