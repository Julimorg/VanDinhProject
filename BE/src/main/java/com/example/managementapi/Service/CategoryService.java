package com.example.managementapi.Service;

import com.example.managementapi.Dto.Request.Category.CreateCategoryReq;
import com.example.managementapi.Dto.Request.Category.UpdateCategoryReq;
import com.example.managementapi.Dto.Response.Category.CreateCategoryRes;
import com.example.managementapi.Dto.Response.Category.GetCategoriesRes;
import com.example.managementapi.Dto.Response.Category.GetDetailCategoryRes;
import com.example.managementapi.Dto.Response.Category.UpdateCategoryRes;
import com.example.managementapi.Dto.Response.Cloudinary.CloudinaryRes;
import com.example.managementapi.Dto.Response.Product.UpdateProductRes;
import com.example.managementapi.Entity.Category;
import com.example.managementapi.Enum.ErrorCode;
import com.example.managementapi.Exception.AppException;
import com.example.managementapi.Mapper.CategoryMapper;
import com.example.managementapi.Repository.CategoryRepository;
import com.example.managementapi.Util.FileUpLoadUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private final CloudinaryService cloudinaryService;

    public CreateCategoryRes createCategory(CreateCategoryReq request){
        if(categoryRepository.existsByCategoryName(request.getCategoryName())){
            throw new AppException(ErrorCode.CATEGORY_EXISTED);
        }

        MultipartFile image = request.getCategoryImage();
        String imgUrl = null;

        if(image != null && !image.isEmpty()){
            FileUpLoadUtil.assertAllowed(image, FileUpLoadUtil.IMAGE_PATTERN);

            String fileName = FileUpLoadUtil.getFileName(request.getCategoryName());

            CloudinaryRes cloudinaryRes = cloudinaryService.uploadFile(image, fileName);

            imgUrl = cloudinaryRes.getUrl();
        }
        else {
            log.info("No image provided for Category: {}", request.getCategoryName());
            throw new RuntimeException("Image is empty!");
        }

        Category category = categoryMapper.toCategory(request);
        category.setCategoryImage(imgUrl);
        category = categoryRepository.save(category);

        return categoryMapper.toCreateCategoryRes(category);
    }

    public UpdateCategoryRes updateCategory(String id, UpdateCategoryReq request){
        MultipartFile image = request.getCategoryImage();
        String imageUrl = null;

        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));

        if(image != null && !image.isEmpty()) {
            FileUpLoadUtil.assertAllowed(image, FileUpLoadUtil.IMAGE_PATTERN);
            String fileName = FileUpLoadUtil.getFileName(request.getCategoryName());
            CloudinaryRes cloudinaryRes = cloudinaryService.uploadFile(image, fileName);
            imageUrl = cloudinaryRes.getUrl();
        }else {
            log.info("No image provided for product: {}", request.getCategoryName());
            throw new RuntimeException("Image is empty!");
        }

        categoryMapper.updateCategory(category, request);
        category.setCategoryImage(imageUrl);
        category = categoryRepository.save(category);

        return categoryMapper.toUpdateCategoryRes(category);
    }

    public Page<GetCategoriesRes> getCategories(Pageable pageable){
        return categoryRepository.findAll(pageable).map(categoryMapper::toGetCategoriesRes);
    }

    public GetDetailCategoryRes getCategory(String id){
        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));

        return categoryMapper.toGetDetailCategoryRes(category);
    }

    public void deleteCategory(String id){
        categoryRepository.deleteById(id);
    }
}
