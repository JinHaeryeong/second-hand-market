package com.example.project.post.controller;

import com.example.project.post.domain.NoticeWriteRequest;
import com.example.project.post.service.NoticeService;
import com.example.project.user.domain.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/notice")
@RestController
public class NoticeController { 

    private final NoticeService noticeService;
    @PostMapping("/write")
    public ResponseEntity<?> noticeWrite(@RequestBody NoticeWriteRequest request) {

        ApiResponse<?> response = noticeService.noticeWrite(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}
