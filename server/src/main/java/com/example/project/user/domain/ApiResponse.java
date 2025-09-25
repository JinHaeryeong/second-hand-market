package com.example.project.user.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiResponse<T> {
    private final String result;
    private final String message;
    private final String errorCode;
    private final T data;

    // 1. 메시지만 받는 success 메서드 (회원가입 성공 시 사용)
    // 정적 메서드에 <T>를 추가하여 제네릭 타입을 명시합니다.
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>("success", message, null, null);
    }

    // 2. 메시지와 데이터를 함께 받는 success 메서드 (로그인 성공 시 사용)
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>("success", message, null, data);
    }

    // 에러 응답
    public static <T> ApiResponse<T> error(String message, String errorCode) {
        return new ApiResponse<>("fail", message, errorCode, null);
    }
}
