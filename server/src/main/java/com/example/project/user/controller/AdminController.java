package com.example.project.user.controller;

import com.example.project.post.domain.NoticesListRequest;
import com.example.project.user.domain.ApiResponse;
import com.example.project.user.domain.SignInRequest;
import com.example.project.user.domain.UsersResponse;
import com.example.project.user.entity.Member;
import com.example.project.user.entity.Role;
import com.example.project.user.service.AdminService;
import com.example.project.user.service.UserService;
import com.example.project.user.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final AdminService adminService;

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse> adminSignIn(@RequestBody SignInRequest request) {
        return ResponseEntity.ok(userService.signIn(request, Role.ROLE_ADMIN));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse> getAllUser(@RequestParam(defaultValue = "1") int page,
                                                  @RequestParam(defaultValue = "5") int size,
                                                  @RequestParam(defaultValue = "") String keyword){
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("userId").descending());

        // Service에서 이미 Page와 ApiResponse로 포장된 객체를 반환
        ApiResponse<Page<UsersResponse>> response =
                adminService.getAllUsers(pageable, keyword); // service의 size 인자는 필요 없으면 제거 가능

        return ResponseEntity
                .ok(response);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id,
                                        @AuthenticationPrincipal(expression = "authorities[0].authority") String currentRole) {

        ApiResponse<?> response = adminService.deleteUserById(id, currentRole);

        return ResponseEntity.ok(response);
    }
}
