package com.example.managementapi.Service;
import com.example.managementapi.Dto.Response.Product.GetProductsRes;
import com.example.managementapi.Dto.Response.Product.ProductRes;
import com.example.managementapi.Entity.Product;
import com.example.managementapi.Entity.Supplier;
import com.example.managementapi.Mapper.ColorMapper;
import com.example.managementapi.Mapper.ProductMapper;
import com.example.managementapi.Mapper.SupplierMapper;
import com.example.managementapi.Repository.ColorRepository;
import com.example.managementapi.Repository.ProductRepository;
import com.example.managementapi.Repository.SupplierRepository;
import com.example.managementapi.Specification.ProductSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ForPublicService {

    private final ColorRepository colorRepository;

    private final SupplierRepository supplierRepository;

    private final ProductRepository productRepository;

    private final ProductMapper productMapper;

    private final SupplierMapper supplierMapper;

    private final ColorMapper colorMapper;

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


}
