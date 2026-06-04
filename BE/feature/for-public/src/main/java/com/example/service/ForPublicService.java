package com.example.service;

import com.example.common.dto.category.response.GetCategoriesSelectionRes;
import com.example.common.interfaces.category.CategoryInternalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ForPublicService {

    private final CategoryInternalService  categoryInternalService;

    public List<GetCategoriesSelectionRes> getCategoriesSelection(){

        GetCategoriesSelectionRes getCategoriesSelectionRes = GetCategoriesSelectionRes
                .builder()
                .build();
        return categoryInternalService.findAll().stream().map(s -> s.getCategoriesSelectionRes );

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
