package com.example.managementapi.Service;
import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Response.Category.GetCategoriesRes;
import com.example.managementapi.Dto.Response.Category.GetCategoriesSelectionRes;
import com.example.managementapi.Dto.Response.Color.GetColorRes;
import com.example.managementapi.Dto.Response.Product.GetProductsRes;
import com.example.managementapi.Dto.Response.Product.ProductRes;
import com.example.managementapi.Dto.Response.Supplier.GetSupplierRes;
import com.example.managementapi.Dto.Response.Supplier.GetSupplierSelectionRes;
import com.example.managementapi.Entity.Category;
import com.example.managementapi.Entity.Color;
import com.example.managementapi.Entity.Product;
import com.example.managementapi.Entity.Supplier;
import com.example.managementapi.Mapper.CategoryMapper;
import com.example.managementapi.Mapper.ColorMapper;
import com.example.managementapi.Mapper.ProductMapper;
import com.example.managementapi.Mapper.SupplierMapper;
import com.example.managementapi.Repository.CategoryRepository;
import com.example.managementapi.Repository.ColorRepository;
import com.example.managementapi.Repository.ProductRepository;
import com.example.managementapi.Repository.SupplierRepository;
import com.example.managementapi.Specification.CategorySpecification;
import com.example.managementapi.Specification.ColorSpecification;
import com.example.managementapi.Specification.ProductSpecification;
import com.example.managementapi.Specification.SupplierSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ForPublicService {

    private final ColorRepository colorRepository;

    private final SupplierRepository supplierRepository;

    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;

    private final ProductMapper productMapper;

    private final SupplierMapper supplierMapper;

    private final ColorMapper colorMapper;

    private final CategoryMapper categoryMapper;

    public List<GetCategoriesSelectionRes> getCategoriesSelection(){
        return categoryRepository.findAll().stream().map(categoryMapper::toGetCategoriesSelectionRes).toList();
    }

    public List<GetSupplierSelectionRes> getSupplierSelection(){
        return supplierRepository.findAll()
                .stream()
                .map(supplier -> supplierMapper.toGetSuppliersSelection(supplier))
                .toList();
    }

    public Page<GetProductsRes> getProducts(String keyword,
                                            String categoryName,
                                            String supplierName,
                                            Double minPrice,
                                            Double maxPrice,
                                            Pageable pageable) {
        Specification<Product> specification = ProductSpecification.searchFilterForProduct(
                keyword,
                categoryName,
                supplierName,
                minPrice,
                maxPrice
        );

        return productRepository.findAll(specification, pageable).map(productMapper::toGetProductsResponses);
    }


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

    public Page<GetSupplierRes> getSuppliers(String keyword, Pageable pageable){
        Specification<Supplier> spec = SupplierSpecification.searchByCriteria(keyword);
        return supplierRepository.findAll(spec,pageable)
                .map(supplier -> supplierMapper.toGetSuppliers(supplier));
    }

    public Page<GetColorRes> getColor(String keyword, String supplierName, Pageable pageable){
        Specification<Color> spec = ColorSpecification.searchByCriteria(keyword, supplierName);
        return colorRepository
                .findAll(spec, pageable)
                .map(color -> colorMapper.toGetColorRes(color));

    }
}
