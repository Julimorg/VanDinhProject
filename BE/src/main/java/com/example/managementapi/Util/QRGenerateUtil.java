package com.example.managementapi.Util;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class QRGenerateUtil {

    // Chuyển object sang dạng json
    public String prettyObject(Object object){
        try{
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(object);
        }catch (JsonProcessingException e){
            e.printStackTrace();
        }

        return "";
    }

    public static String generateQrCode(String data, int width, int height){
        StringBuilder result = new StringBuilder();

        if(!data.isEmpty()){
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            try {
                QRCodeWriter writer = new QRCodeWriter();

                Map<EncodeHintType, Object> hints = new HashMap<>();
                hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");

                //mã hóa thông tin vào matrix, hàm encode sẽ mã hóa thành những định dạng khác nhau
                BitMatrix bitMatrix = writer.encode(data, BarcodeFormat.QR_CODE, width, height, hints);

                BufferedImage bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
                ImageIO.write(bufferedImage, "png", os);

                result.append("data:image/png;base64,");
                result.append(new String(Base64.getEncoder().encode(os.toByteArray())));
            } catch (Exception e) {
                e.printStackTrace();
            }


        }

        return result.toString();
    }
}
