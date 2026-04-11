package com.example.common.response;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private int status_code;
    private String message;
    private T data;


    private LocalDateTime timestamp = LocalDateTime.now();

    public static <T> ApiResponse<T> success(T data){
        return ApiResponse.<T>builder()
                .status_code(200)
                .message("Successfully!")
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .status_code(200)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> created(T data) {
        return ApiResponse.<T>builder()
                .status_code(201)
                .message("Created successfully")
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> error(int statusCode, String message) {
        return ApiResponse.<T>builder()
                .status_code(statusCode)
                .message(message)
                .build();
    }
}
