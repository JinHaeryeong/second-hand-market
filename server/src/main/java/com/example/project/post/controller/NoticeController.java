package com.example.project.user.controller;

import com.example.project.user.domain.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/notice")
@RestController
public class NoticeController { 
    
    @PostMapping("/write")
    public ResponseEntity<?> noticeWrite() {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("공지사항 작성 완료"));
    }
}
