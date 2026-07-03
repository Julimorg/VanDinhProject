package com.example.service;

import com.example.common.dto.product.request.UpdateProductReq;
import com.example.common.interfaces.category.CategoryQueryInternalService;
import com.example.common.interfaces.supplier.SupplierQueryInternalService;
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

    private final CategoryQueryInternalService categoryInternalService;

    private final SupplierQueryInternalService supplierInternalService;

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


    public void checkSupplierCategoryAndSetThemIntoProduct(Product product,
                                                           String supplierId,
                                                           String categoryId){

        if (supplierId != null){

            Supplier supplier = supplierInternalService.getSupplierById(supplierId);

            product.setSupplier(supplier);
        }

        if( categoryId != null){

            Category category = categoryInternalService.getCategory(categoryId);

            product.setCategory(category);

        }

    }

}
