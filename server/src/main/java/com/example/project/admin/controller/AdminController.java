package com.example.project.admin.controller;

import com.example.project.admin.domain.MemberDto;
import com.example.project.admin.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("")
    public String index() {
        return "index";
    }

    @GetMapping("/users")
    public List<MemberDto> getAllUsers() {
        return adminService.findAllUser();
    }
}
