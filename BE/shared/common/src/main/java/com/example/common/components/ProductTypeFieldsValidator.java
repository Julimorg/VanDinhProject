package com.example.common.components;

import com.example.common.annotationCustome.ValidProductTypeFields;
import com.example.common.dto.product.request.CreateProductReq;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.ArrayList;
import java.util.List;


public class ProductTypeFieldsValidator
        implements ConstraintValidator<ValidProductTypeFields, CreateProductReq> {

    private boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    @Override
    public void initialize(ValidProductTypeFields constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(CreateProductReq req, ConstraintValidatorContext ctx) {

        if (req.getProductType() == null) return true;

        ctx.disableDefaultConstraintViolation();

        return switch (req.getProductType()) {
            case PAINT -> {
                List<String> errors = new ArrayList<>();
                if (isBlank(req.getColorId()))
                    errors.add("colorId: Màu sơn không được trống");

                if (isBlank(req.getSurfaceType()))
                    errors.add("surfaceType: Bề mặt không được trống");

                if (isBlank(req.getVolume()))
                    errors.add("volume: Dung tích không được trống");

                errors.forEach(msg ->
                        ctx.buildConstraintViolationWithTemplate(msg)
                                .addConstraintViolation()
                );
                yield errors.isEmpty();
            }
            case TOOL -> {
                if (isBlank(req.getToolType())) {
                    ctx.buildConstraintViolationWithTemplate("toolType: Loại dụng cụ không được trống")
                            .addConstraintViolation();
                    yield false;
                }
                yield true;
            }
            case CHEMICAL -> {
                if (isBlank(req.getChemicalType())) {
                    ctx.buildConstraintViolationWithTemplate("chemicalType: Loại hóa chất không được trống")
                            .addConstraintViolation();
                    yield false;
                }
                yield true;
            }
        };
    }
}
