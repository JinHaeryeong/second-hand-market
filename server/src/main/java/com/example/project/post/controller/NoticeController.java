package com.example.project.post.controller;

import com.example.project.post.domain.NoticeDetailResponse;
import com.example.project.post.domain.NoticeEditRequest;
import com.example.project.post.domain.NoticeWriteRequest;
import com.example.project.post.domain.NoticesListRequest;
import com.example.project.post.entity.Notices;
import com.example.project.post.service.NoticeService;
import com.example.project.user.domain.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/notices")
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

    @GetMapping("/list")
    public ResponseEntity<?> noticesList(@RequestParam(defaultValue = "1") int page,
                                         @RequestParam(defaultValue = "5") int size,
                                         @RequestParam(defaultValue = "0") int findType,
                                         @RequestParam(defaultValue = "") String keyword) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("id").descending());

        // Service에서 이미 Page와 ApiResponse로 포장된 객체를 반환
        ApiResponse<Page<NoticesListRequest>> response =
                noticeService.getNoticesList(pageable, findType, keyword); // service의 size 인자는 필요 없으면 제거 가능

        return ResponseEntity
                .ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Integer id){
        log.info("id==={}",id);

        ApiResponse<NoticeDetailResponse> response = noticeService.getPostById(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePostById(@PathVariable Integer id) {
        log.info("id==={}", id);
        ApiResponse<?> response  = noticeService.deletePostById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editPostById(@PathVariable Integer id, @RequestBody NoticeEditRequest noticeEditRequest) {
        ApiResponse<?> reponse = noticeService.editPostById(id, noticeEditRequest);

        return ResponseEntity.ok(reponse);
    }
}
