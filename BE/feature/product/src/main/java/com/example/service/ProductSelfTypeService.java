package com.example.service;

import com.example.common.dto.product.request.CreateProductReq;
import com.example.common.dto.product.response.CreateProductRes;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.color.ColorInternalService;
import com.example.mapper.PaintDetailMapper;
import com.example.mapper.ProductMapper;
import com.example.persistence.entity.*;
import com.example.repository.ChemicalDetailRepository;
import com.example.repository.PaintDetailRepository;
import com.example.repository.ToolDetailRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductSelfTypeService {

    private final ColorInternalService colorInternalService;

    private final PaintDetailRepository  paintDetailRepository;

    private final ToolDetailRepository toolDetailRepository;

    private final ChemicalDetailRepository chemicalDetailRepository;

    private final ProductMapper productMapper;

    public CreateProductRes createPaintProduct(Product product,
                                               CreateProductReq req) {

        Color color = colorInternalService.getColorById(req.getColorId());

        //? Validate color thuộc đúng supplier
        if (!color.getSupplier().getSupplierId()
                .equals(product.getSupplier().getSupplierId())) {
            throw new AppException(ErrorCode.COLOR_DOES_NOT_FIT_WITH_SUPPLIER);
        }

        PaintDetail detail = PaintDetail.builder()
                .product(product)
                .color(color)
                .surfaceType(req.getSurfaceType())
                .volume(req.getVolume())
                .extraSpecs(req.getExtraSpecs())
                .build();

        paintDetailRepository.save(detail);

        return productMapper.toPaintResponse(product, detail);
    }

    public CreateProductRes createToolProduct(Product product,
                                                    CreateProductReq req) {
        ToolDetail detail = ToolDetail.builder()
                .product(product)
                .toolType(req.getToolType())
                .size(req.getToolSize())
                .extraSpecs(req.getExtraSpecs())
                .build();

        toolDetailRepository.save(detail);

        return productMapper.toToolResponse(product, detail);
    }


    public CreateProductRes createChemicalProduct(Product product,
                                                        CreateProductReq req) {
        ChemicalDetail detail = ChemicalDetail.builder()
                .product(product)
                .chemicalType(req.getChemicalType())
                .volume(req.getChemicalVolume())
                .extraSpecs(req.getExtraSpecs())
                .build();

        chemicalDetailRepository.save(detail);

        return productMapper.toChemicalResponse(product, detail);
    }
}
