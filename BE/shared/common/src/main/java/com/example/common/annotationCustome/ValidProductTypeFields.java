package com.example.common.annotationCustome;

import com.example.common.components.ProductTypeFieldsValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ProductTypeFieldsValidator.class)
public @interface ValidProductTypeFields {

    String message() default "Thông tin sản phẩm không hợp lệ theo loại";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
