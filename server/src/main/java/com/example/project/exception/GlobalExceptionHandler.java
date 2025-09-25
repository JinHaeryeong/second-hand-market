// src/main/java/com/example/project/exception/GlobalExceptionHandler.java

package com.example.project.exception;

import com.example.project.user.domain.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice // 모든 @Controller에서 발생하는 예외를 처리
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateUserIdException.class)
    public ResponseEntity<ApiResponse> handleDuplicateUserIdException(DuplicateUserIdException e) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT) // 409 Conflict 상태 코드
                .body(ApiResponse.error(e.getMessage(), "DUPLICATE_USERID"));
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<ApiResponse> handleDuplicateEmailException(DuplicateEmailException e) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(e.getMessage(), "DUPLICATE_EMAIL"));
    }

    // 닉네임 중복 예외 처리 핸들러 추가
    @ExceptionHandler(DuplicateNicknameException.class)
    public ResponseEntity<ApiResponse> handleDuplicateNicknameException(DuplicateNicknameException e) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(e.getMessage(), "DUPLICATE_NICKNAME"));
    }
    // 다른 예외를 처리하는 핸들러를 추가할 수 있습니다.
    // @ExceptionHandler(ValidationException.class)
    // public ResponseEntity<ApiResponse> handleValidationException(ValidationException e) {
    //     return ResponseEntity
    //             .status(HttpStatus.BAD_REQUEST)
    //             .body(ApiResponse.fail(e.getMessage()));
    // }
    @ExceptionHandler({UsernameNotFoundException.class, BadCredentialsException.class})
    public ResponseEntity<ApiResponse> handleAuthenticationException(Exception e) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED) // 401 Unauthorized 상태 코드
                .body(ApiResponse.error("아이디 또는 비밀번호가 일치하지 않습니다.", "LOGIN_FAILED"));
    }

    // 예상치 못한 모든 예외를 처리하는 핸들러
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleAllExceptions(Exception e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR) // 500 Internal Server Error
                .body(ApiResponse.error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", "SERVER ERROR"));
    }



}