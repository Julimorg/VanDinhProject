package com.example.common.exception;

import com.example.common.enums.ErrorCode;
import com.example.common.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler  {

    @ExceptionHandler(RuntimeException.class)
    ResponseEntity<ApiResponse<Void>> handleRunTimeException(RuntimeException exception) {
        log.error("RuntimeException: {}", exception.getMessage());
        ErrorCode errorCode = ErrorCode.UNKNOWN_ERROR;
        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(ApiResponse.<Void>builder()
                        .status_code(((org.springframework.http.HttpStatus) errorCode.getStatusCode()).value())
                        .message(exception.getMessage() != null ? exception.getMessage() : errorCode.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @ExceptionHandler(UserBannedException.class)
    ResponseEntity<ApiResponse<Void>> handleUserBanned(UserBannedException exception) {
        ErrorCode errorCode = ErrorCode.BANNED;
        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(ApiResponse.<Void>builder()
                        .status_code(((HttpStatus) errorCode.getStatusCode()).value())
                        .message(errorCode.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @ExceptionHandler(AccessDeniedException.class)
    ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(AccessDeniedException exception) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.<Void>builder()
                        .status_code(HttpStatus.FORBIDDEN.value())
                        .message(exception.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @ExceptionHandler(AppException.class)
    ResponseEntity<ApiResponse<Void>> handleAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(ApiResponse.<Void>builder()
                        .status_code(((HttpStatus) errorCode.getStatusCode()).value())
                        .message(errorCode.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @ExceptionHandler(NoResourceFoundException.class)
    ResponseEntity<ApiResponse<Void>> handleNoResourceFoundException(NoResourceFoundException exception) {
        ErrorCode errorCode = ErrorCode.WRONG_PATH;
        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(ApiResponse.<Void>builder()
                        .status_code(((HttpStatus) errorCode.getStatusCode()).value())
                        .message(errorCode.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException exception) {
        String enumKey = exception.getFieldError() != null
                ? exception.getFieldError().getDefaultMessage()
                : null;

        ErrorCode errorCode;
        try {
            errorCode = enumKey != null ? ErrorCode.valueOf(enumKey) : ErrorCode.UNKNOWN_ERROR;
        } catch (IllegalArgumentException e) {
            errorCode = ErrorCode.UNKNOWN_ERROR;
        }

        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(ApiResponse.<Void>builder()
                        .status_code(((HttpStatus) errorCode.getStatusCode()).value())
                        .message(errorCode.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build());
    }
}