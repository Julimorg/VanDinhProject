package com.example.service;

import com.example.common.dto.color.*;
import com.example.common.dto.color.request.CreateColorReq;
import com.example.common.dto.color.request.UpdateColorReq;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.color.ColorServiceInterface;
import com.example.common.interfaces.supplier.SupplierQueryInternalService;
import com.example.common.service.CloudinaryService;
import com.example.common.service.FileUploadService;
import com.example.config.ColorSpecification;
import com.example.mapper.ColorMapper;
import com.example.persistence.entity.Color;
import com.example.persistence.entity.Supplier;
import com.example.repository.ColorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ColorService implements ColorServiceInterface {

    private final ColorRepository colorRepository;

    private final ColorMapper  colorMapper;

    private final CloudinaryService  cloudinaryService;

    private final SupplierQueryInternalService supplierInternalService;

    private final FileUploadService fileUploadService;

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF', 'ROLE_USER')")
    public List<GetColorWithSupplierRes> getColorWithSupplier(String supplierId){

        supplierInternalService.validateSupplierExists(supplierId);

        return colorRepository
                .findBySupplier_SupplierId(supplierId)
                .stream()
                .map(colorMapper::toGetColorWithSupplier)
                .toList();
    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER','ROLE_STAFF')")
    public Page<GetColorRes> getColor(String keyword,
                                      String supplierName,
                                      Pageable pageable){
        Specification<Color> spec = ColorSpecification
                .from(ColorSpecification
                        .ColorFilter
                        .keywordAndSupplier(keyword, supplierName));

        return colorRepository
                .findAll(spec, pageable)
                .map(color -> colorMapper.toGetColorRes(color));

    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER','ROLE_STAFF')")
    public GetColorDetailRes getColorDetail(String colorId){

        Color color = colorRepository.findById(colorId)
                .orElseThrow(() -> new RuntimeException("Color not found!"));

        return colorMapper.toGetColorDetailRes(color);
    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public CreateColorRes createColor(CreateColorReq request){

        if(request.getSupplierId().isEmpty())
            throw new AppException(ErrorCode.SUPPLIER_NOT_FOUND);

        Supplier supplierDto = supplierInternalService
                .getSupplierById(request
                        .getSupplierId());

        Color color = colorMapper.toCreateColorReq(request);

        color.setSupplier(supplierDto);

        color.setColorImg(fileUploadService
                .uploadImageIfPresent(request.getColorImg(), request.getColorName()));

        color = colorRepository.save(color);

        return colorMapper.toCreateColorRes(color);
    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public UpdateColorRes updateColor(String colorId, UpdateColorReq request) {

        Color color = colorRepository
                .findById(colorId)
                .orElseThrow(() -> new RuntimeException("Color not Found!"));

        color.setColorImg(fileUploadService.uploadImageIfPresent(request.getColorImg(), request.getColorName()));

        colorMapper.toUpdateColor(color, request);

        color = colorRepository.save(color);
        return colorMapper.toUpdateColorRes(color);
    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public void deleteColor(String colorId){
        if(!colorRepository.existsById(colorId)){
            throw new AppException(ErrorCode.COLOR_NOT_FOUND);
        }
        colorRepository.deleteById(colorId);
    }

}
