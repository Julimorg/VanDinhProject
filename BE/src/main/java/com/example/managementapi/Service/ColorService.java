package com.example.managementapi.Service;

import com.cloudinary.Cloudinary;
import com.example.managementapi.Dto.Request.Color.CreateColorReq;
import com.example.managementapi.Dto.Request.Color.UpdateColorReq;
import com.example.managementapi.Dto.Response.Cloudinary.CloudinaryRes;
import com.example.managementapi.Dto.Response.Color.CreateColorRes;
import com.example.managementapi.Dto.Response.Color.GetColorDetailRes;
import com.example.managementapi.Dto.Response.Color.GetColorRes;
import com.example.managementapi.Dto.Response.Color.UpdateColorRes;
import com.example.managementapi.Entity.Color;
import com.example.managementapi.Mapper.ColorMapper;
import com.example.managementapi.Repository.ColorRepository;
import com.example.managementapi.Specification.ColorSpecification;
import com.example.managementapi.Util.FileUpLoadUtil;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.Cache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ColorService {
    @Autowired
    private final ColorRepository colorRepository;

    @Autowired
    private final CloudinaryService cloudinaryService;

    @Autowired
    private final ColorMapper colorMapper;

    public List<GetColorRes> getColor(){
        return colorRepository
                .findAll()
                .stream()
                .map(color -> colorMapper.toGetColorRes(color))
                .toList();
    }
    public GetColorDetailRes getColorDetail(String colorId){
        return colorMapper
                .toGetColorDetailRes(colorRepository
                        .findById(colorId)
                        .orElseThrow(() -> new RuntimeException("Color not found!")));
    }
    public CreateColorRes createColor(CreateColorReq request){

        MultipartFile image = request.getColorImg();
        String imageUrl = null;

        if (image != null && !image.isEmpty()) {

            //? lấy FileUpLoadUtil để check định dạng File có valid hay không
            FileUpLoadUtil.assertAllowed(image, FileUpLoadUtil.IMAGE_PATTERN);

            //? Generate FileName từ field colorName
            String fileName = FileUpLoadUtil.getFileName(request.getColorName());

            //? Gọi thằng CloudinaryService để upFile
            CloudinaryRes cloudinaryRes = cloudinaryService.uploadFile(image, fileName);

            //? Hứng url từ CloudinaryRes cho thằng imageUrl
            imageUrl = cloudinaryRes.getUrl();
        } else {
            log.info("No image provided for color: {}", request.getColorName());
            throw new RuntimeException("Image is empty!");
        }

        Color color = colorMapper.toCreateColorReq(request);

        //? gán url đã hứng vào field colorImg
        color.setColorImg(imageUrl);

        color = colorRepository.save(color);

        return colorMapper.toCreateColorRes(color);
    }


    public UpdateColorRes updateColor(String colorId, UpdateColorReq request) {

        MultipartFile image = request.getColorImg();

        String imageUrl = null;

        Color color = colorRepository
                .findById(colorId)
                .orElseThrow(() -> new RuntimeException("Color not Found!"));

        if(image != null && !image.isEmpty()) {
            FileUpLoadUtil.assertAllowed(image, FileUpLoadUtil.IMAGE_PATTERN);
            String fileName = FileUpLoadUtil.getFileName(request.getColorName());
            CloudinaryRes cloudinaryRes = cloudinaryService.uploadFile(image, fileName);
            imageUrl = cloudinaryRes.getUrl();
        }else {
            log.info("No image provided for color: {}", request.getColorName());
            throw new RuntimeException("Image is empty!");
        }

        colorMapper.toUpdateColor(color, request);

        color.setColorImg(imageUrl);

        color = colorRepository.save(color);
        return colorMapper.toUpdateColorRes(color);
    }

    public Page<GetColorRes> searchColor(String keyword, String filter,  Pageable pageable){
        Specification<Color> spec = ColorSpecification.searchByCriteria(keyword, filter);
        Page<Color> colorPage = colorRepository.findAll(spec, pageable);
        return colorPage.map(color -> colorMapper.toGetColorRes(color));
    }

    public void deleteColor(String colorId){
        if(!colorRepository.existsById(colorId)){
            throw new RuntimeException("Color not Found!");
        }
        colorRepository.deleteById(colorId);
    }

}
