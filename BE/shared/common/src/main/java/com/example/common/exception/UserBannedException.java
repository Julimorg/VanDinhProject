package com.example.common.exception;

public class UserBannedException extends RuntimeException {
    public UserBannedException(String message) {
        super(message);
    }
}