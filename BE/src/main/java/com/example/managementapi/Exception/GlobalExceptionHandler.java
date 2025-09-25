package com.example.managementapi.Exception;

import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Enum.ErrorCode;
import org.hibernate.boot.model.naming.IllegalIdentifierException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.Date;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<ApiResponse> handlingRunTimeException(RuntimeException exception) {
        ErrorCode errorCode = ErrorCode.UNKNOWN_ERROR;

        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(ApiResponse.builder()
                        .status_code(errorCode.getStatusCode().value())
                        .message(exception.getMessage() != null ? exception.getMessage() : errorCode.getMessage())
                        .data(null)
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @ExceptionHandler(UserBannedException.class)
    public ResponseEntity<ApiResponse<?>> handleUserBanned(UserBannedException exception) {
        ErrorCode errorCode = ErrorCode.BANNED;

        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(ApiResponse
                        .builder()
                        .status_code(errorCode.getStatusCode().value())
                        .message(errorCode.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @ExceptionHandler(value =  AccessDeniedException.class)
    ResponseEntity<ApiResponse<Object>> handlingAccessDeniedException(AccessDeniedException exception) {

        ApiResponse<Object> response = ApiResponse.builder()
                .status_code(HttpStatus.FORBIDDEN.value())
                .message(exception.getMessage())
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handlingAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();

        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(ApiResponse.builder()
                        .status_code(errorCode.getStatusCode().value())
                        .message(errorCode.getMessage())
                        .data(null)
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @ExceptionHandler(value = NoResourceFoundException.class)
    ResponseEntity<ApiResponse> handlingIllegalArgumentException(NoResourceFoundException exception) {
        ErrorCode errorCode = ErrorCode.WRONG_PATH;

        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(ApiResponse
                        .builder()
                        .status_code(errorCode.getStatusCode().value())
                        .message(errorCode.getMessage())
                        .data(null)
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse> handlingValidationException(MethodArgumentNotValidException exception) {

        String enumKey = exception.getFieldError() != null ? exception.getFieldError().getDefaultMessage() : null;
        ErrorCode errorCode;

        try {
            errorCode = enumKey != null ? ErrorCode.valueOf(enumKey) : ErrorCode.UNKNOWN_ERROR;
        } catch (IllegalArgumentException e) {
            errorCode = ErrorCode.UNKNOWN_ERROR;
        }

        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(ApiResponse.builder()
                        .status_code(errorCode.getStatusCode().value())
                        .message(errorCode.getMessage())
                        .data(null)
                        .timestamp(LocalDateTime.now())
                        .build());
    }
}
