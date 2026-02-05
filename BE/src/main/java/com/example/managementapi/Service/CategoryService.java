package com.example.managementapi.Service;

import com.example.managementapi.Dto.Request.Category.CreateCategoryReq;
import com.example.managementapi.Dto.Request.Category.UpdateCategoryReq;
import com.example.managementapi.Dto.Response.Category.*;
import com.example.managementapi.Dto.Response.Cloudinary.CloudinaryRes;
import com.example.managementapi.Entity.Category;
import com.example.managementapi.Enum.ErrorCode;
import com.example.managementapi.Exception.AppException;
import com.example.managementapi.Mapper.CategoryMapper;
import com.example.managementapi.Repository.CategoryRepository;
import com.example.managementapi.Specification.CategorySpecification;
import com.example.managementapi.Util.FileUpLoadUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
public class CategoryService {

    private final CategoryRepository categoryRepository;

    private final CategoryMapper categoryMapper;

    private final CloudinaryService cloudinaryService;

    private final ElasticSearchService elasticSearchService;


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
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
            imgUrl = "https://placehold.net/default.png";
//            throw new RuntimeException("Image is empty!");
        }

        Category category = categoryMapper.toCategory(request);
        category.setCategoryImage(imgUrl);
        category = categoryRepository.save(category);
        elasticSearchService.saveCategory(category);

        return categoryMapper.toCreateCategoryRes(category);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public UpdateCategoryRes updateCategory(String id, UpdateCategoryReq request){
        MultipartFile image = request.getCategoryImage();
        String imageUrl = null;

        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
        if(image != null && !image.isEmpty()) {
            FileUpLoadUtil.assertAllowed(image, FileUpLoadUtil.IMAGE_PATTERN);
            String fileName = FileUpLoadUtil.getFileName(request.getCategoryName());
            CloudinaryRes cloudinaryRes = cloudinaryService.uploadFile(image, fileName);
            imageUrl = cloudinaryRes.getUrl();
            //Đề vào trong hàm if này để tránh image null nếu update không chọn image khác
            category.setCategoryImage(imageUrl);
        }

        categoryMapper.updateCategory(category, request);

        category = categoryRepository.save(category);
        elasticSearchService.saveCategory(category);

        return categoryMapper.toUpdateCategoryRes(category);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF', 'ROLE_USER')")
    public List<GetCategoriesSelectionRes> getCategoriesSelection(){
        return categoryRepository.findAll().stream().map(categoryMapper::toGetCategoriesSelectionRes).toList();
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public Page<GetCategoriesRes> getCategories(Pageable pageable, String keyword){
        Specification<Category> specification = CategorySpecification.hasKeyword(keyword);
        return categoryRepository.findAll(specification, pageable)
                .map(categoryMapper::toGetCategoriesRes);

    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public GetDetailCategoryRes getCategory(String id){
        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));

        return categoryMapper.toGetDetailCategoryRes(category);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public void deleteCategory(String id){
        elasticSearchService.delete("C_"+id);
        categoryRepository.deleteById(id);
    }
}
