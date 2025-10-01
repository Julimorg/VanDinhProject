package com.example.managementapi.Service;

import com.example.managementapi.Dto.Request.Product.CreateProductReq;
import com.example.managementapi.Dto.Request.Product.UpdateProductReq;
import com.example.managementapi.Dto.Response.Cloudinary.CloudinaryRes;
import com.example.managementapi.Dto.Response.Product.*;
import com.example.managementapi.Entity.Category;
import com.example.managementapi.Entity.Color;
import com.example.managementapi.Entity.Product;
import com.example.managementapi.Entity.Supplier;
import com.example.managementapi.Enum.ErrorCode;
import com.example.managementapi.Exception.AppException;
import com.example.managementapi.Mapper.ProductMapper;
import com.example.managementapi.Repository.CategoryRepository;
import com.example.managementapi.Repository.ColorRepository;
import com.example.managementapi.Repository.ProductRepository;
import com.example.managementapi.Repository.SupplierRepository;
import com.example.managementapi.Specification.ProductSpecification;
import com.example.managementapi.Util.FileUpLoadUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.converters.models.Sort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private SupplierRepository supplierRepository;
    @Autowired
    private ColorRepository colorRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private final CloudinaryService cloudinaryService;

    //Tạo product
    public CreateProductRes createProduct(CreateProductReq request){
        if(productRepository.existsByProductName(request.getProductName())){
            throw new AppException(ErrorCode.PRODUCT_EXISTED);
        }

        MultipartFile[] images = request.getProductImage();
        List<String> imgUrls = new ArrayList<>();

        for(MultipartFile image : images){
            if(image != null && !image.isEmpty()){
                FileUpLoadUtil.assertAllowed(image, FileUpLoadUtil.IMAGE_PATTERN);
                String fileName = FileUpLoadUtil.getFileName(request.getProductName());
                CloudinaryRes cloudinaryRes = cloudinaryService.uploadFile(image, fileName);
                imgUrls.add(cloudinaryRes.getUrl());
            }
            else {
                log.info("No image provided for product: {}", request.getProductName());
                throw new RuntimeException("Image is empty!");
            }

        }

        Product product = productMapper.toProduct(request);

        if(request.getSupplierId() != null){
            Supplier supplier = supplierRepository.findById(request.getSupplierId()).orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_NOT_EXISTED));
            product.setSupplier(supplier);
        }

        if(request.getColorId() != null){
            Color color = colorRepository.findById(request.getColorId()).orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_EXISTED));
            product.setColor(color);
        }

        if(request.getCategoryId() != null){
            Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
            product.setCategory(category);
        }

        if(request.getProductQuantity() > 10000000){
            throw new AppException(ErrorCode.PRODUCT_EXCEED_LIMIT);
        }

        //*
        product.setProductImage(imgUrls);

        Product savedProduct = productRepository.save(product);

        CreateProductRes response = productMapper.toCreateProductResponse(savedProduct);

        //Có thể dùng @Mapper để trả về supplierName, colorName, categoryName trong Mapper thay vì set trong service
        if(savedProduct.getSupplier() != null){
            response.setSupplierName(savedProduct.getSupplier().getSupplierName());
        }

        if(savedProduct.getColor() != null){
            response.setColorName(savedProduct.getColor().getColorName());
        }

        if(savedProduct.getCategory() != null){
            response.setCategoryName(savedProduct.getCategory().getCategoryName());
        }

        return response;
//        product.setName(request.getName());
//        product.setDescription(request.getDescription());
//        product.setPrice(request.getPrice());
//        product.setStatus(request.getStatus());
//        product.setQuantity(request.getQuantity());
    }

    //Get list product
    //Note: get thủ công cho supplier
    // Check xem findALl xem co lay them nhung thang ENtity ko lien quan ko
    public Page<GetProductsRes> getProducts(String categoryName, String supplierName, Double minPrice, Double maxPrice, Pageable pageable){

        Specification<Product> specification = ProductSpecification.filterProduct(categoryName, supplierName, minPrice, maxPrice);

        return productRepository.findAll(specification, pageable).map(productMapper::toGetProductsResponses);
    }

    //Get 1 product
    public ProductRes getProduct(String id){
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductRes response = productMapper.toProductResponse(product);

        if (product.getSupplier() != null) {
            response.setSupplierName(product.getSupplier().getSupplierName());
        }

        if(product.getColor() != null){
            response.setColorName(product.getColor().getColorName());
        }

        if(product.getCategory() != null){
            response.setCategoryName(product.getCategory().getCategoryName());
        }

        return response;
    }

    //Update Product
    public UpdateProductRes updateProduct(String id, UpdateProductReq request){
        MultipartFile[] images = request.getProductImage();
        List<String> imageUrls = new ArrayList<>();

        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));

        for(MultipartFile image : images){
            if(image != null && !image.isEmpty()) {
                FileUpLoadUtil.assertAllowed(image, FileUpLoadUtil.IMAGE_PATTERN);
                String fileName = FileUpLoadUtil.getFileName(request.getProductName());
                CloudinaryRes cloudinaryRes = cloudinaryService.uploadFile(image, fileName);
                imageUrls.add(cloudinaryRes.getUrl());
            }else {
                log.info("No image provided for product: {}", request.getProductName());
                throw new RuntimeException("Image is empty!");
            }
        }


        productMapper.updateProduct(product, request);

        product.setProductImage(imageUrls);

        Product savedProduct = productRepository.save(product);

        UpdateProductRes response = productMapper.toUpdateProductRes(savedProduct);

        if (savedProduct.getSupplier() != null) {
            response.setSupplierName(savedProduct.getSupplier().getSupplierName());
        }

        if(savedProduct.getColor() != null){
            response.setColorName(savedProduct.getColor().getColorName());
        }

        if(savedProduct.getCategory() != null){
            response.setCategoryName(savedProduct.getCategory().getCategoryName());
        }

        return response;

//        product.setDescription(request.getDescription());
//        product.setPrice(request.getPrice());
//        product.setStatus(request.getStatus());
//        product.setQuantity(request.getQuantity());

    }

    public void deleteProduct(String id){
        productRepository.deleteById(id);
    }

    public Page<GetProductsRes> searchProducts(String keyword, String categoryName, String supplierName, Pageable pageable){
        Specification<Product> specification = ProductSpecification.searchProduct(keyword, categoryName, supplierName);
        Page<Product> products = productRepository.findAll(specification, pageable);

        return products.map(product -> productMapper.toGetProductsResponses(product));
    }


}
