package com.example.project.user.controller;

import com.example.project.user.domain.ApiResponse;
import com.example.project.user.domain.SignInRequest;
import com.example.project.user.entity.Member;
import com.example.project.user.entity.Role;
import com.example.project.user.service.UserService;
import com.example.project.user.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse> adminSignIn(@RequestBody SignInRequest request) {
        return ResponseEntity.ok(userService.signIn(request, Role.ROLE_ADMIN));
    }
}
