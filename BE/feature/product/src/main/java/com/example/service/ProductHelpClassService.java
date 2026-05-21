package com.example.service;

import com.example.common.dto.product.request.UpdateProductReq;
import com.example.common.interfaces.category.CategoryInternalService;
import com.example.common.interfaces.supplier.SupplierInternalService;
import com.example.common.service.FileUploadService;
import com.example.persistence.entity.Category;
import com.example.persistence.entity.Product;
import com.example.persistence.entity.Supplier;
import com.example.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductHelpClassService {

    private final CategoryInternalService  categoryInternalService;

    private final SupplierInternalService   supplierInternalService;

    private final ProductRepository productRepository;

    private final FileUploadService fileUploadService;

    public List<String> uploadImages(UpdateProductReq request){

        List<String> urls = new ArrayList<>();

        if (request.getProductImage() == null || request.getProductImage().length == 0) {
            return urls;
        }
        for (MultipartFile file : request.getProductImage()) {
            String url = fileUploadService
                    .uploadImageIfPresent(file, request.getProductName());
            if (url != null) urls.add(url);
        }
        return urls;
    }


    public void checkSupplierCategoryAndSetThemIntoProduct(String productId,
                                                           String supplierId,
                                                           String categoryId){

        Product product = productRepository.findByProductId(productId);

        if (supplierId != null){

            log.info("Supplier Id is in: {}", supplierId);

            Supplier supplier = supplierInternalService.getSupplierById(supplierId);

            log.info("Get Supplier ID: {}", supplier.getSupplierId());

            product.setSupplier(supplier);

            log.info("===== Product Supplier : {} ", product.getSupplier());
        }

        if( categoryId != null){

            Category category = categoryInternalService.getCategory(categoryId);

            product.setCategory(category);

        }

    }

}
