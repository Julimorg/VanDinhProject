package com.example.managementapi.Service;

import com.cloudinary.Cloudinary;
import com.example.managementapi.Dto.Request.Color.CreateColorReq;
import com.example.managementapi.Dto.Request.Color.UpdateColorReq;
import com.example.managementapi.Dto.Response.Cloudinary.CloudinaryRes;
import com.example.managementapi.Dto.Response.Color.*;
import com.example.managementapi.Entity.Color;
import com.example.managementapi.Entity.Supplier;
import com.example.managementapi.Mapper.ColorMapper;
import com.example.managementapi.Repository.ColorRepository;
import com.example.managementapi.Repository.SupplierRepository;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ColorService {

    private final SupplierRepository supplierRepository;

    private final ColorRepository colorRepository;

    private final CloudinaryService cloudinaryService;

    private final ColorMapper colorMapper;

    public Page<GetColorRes> searchColor(String keyword, String filter,  Pageable pageable){
        Specification<Color> spec = ColorSpecification.searchByCriteria(keyword, filter);
        Page<Color> colorPage = colorRepository.findAll(spec, pageable);
        return colorPage.map(color -> colorMapper.toGetColorRes(color));
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER','ROLE_STAFF')")
    public Page<GetColorRes> getColor(String supplierName,Pageable pageable){
        Specification<Color> spec = ColorSpecification.filterBySupplier(supplierName);
        return colorRepository
                .findAll(spec, pageable)
                .map(color -> colorMapper.toGetColorRes(color));

    }

    public GetColorDetailRes getColorDetail(String colorId){

        Color color = colorRepository.findById(colorId)
                .orElseThrow(() -> new RuntimeException("Color not found!"));

        return colorMapper.toGetColorDetailRes(color);
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

        if(request.getSupplierId().isEmpty())
            throw new RuntimeException("Supplier cannot be empty");

        Supplier supplier = supplierRepository
                    .findById(request.getSupplierId())
                    .orElseThrow(() -> new RuntimeException("Supplier not found!"));

        color.setSupplier(supplier);

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

    public void deleteColor(String colorId){
        if(!colorRepository.existsById(colorId)){
            throw new RuntimeException("Color not Found!");
        }
        colorRepository.deleteById(colorId);
    }

}
