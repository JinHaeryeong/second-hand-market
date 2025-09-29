package com.example.project.post.controller;

import com.example.project.post.domain.*;
import com.example.project.post.service.MarketService;
import com.example.project.user.domain.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/market")
@RestController
public class MarketController {

    private final MarketService marketService;
    @PostMapping("/write")
    public ResponseEntity<?> sellItemWrite(@RequestBody MarketWriteRequest request) {

        ApiResponse<?> response = marketService.sellItemWrite(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/list")
    public ResponseEntity<?> getItemList(@RequestParam(defaultValue = "1") int page,
                                         @RequestParam(defaultValue = "15") int size,
                                         @RequestParam(defaultValue = "0") int findType,
                                         @RequestParam(defaultValue = "") String keyword) {
        log.info("list 들어옴");
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("id").descending());

        // Service에서 이미 Page와 ApiResponse로 포장된 객체를 반환
        ApiResponse<Page<ItemListResponse>> response =
                marketService.getItemList(pageable, findType, keyword); // service의 size 인자는 필요 없으면 제거 가능

        return ResponseEntity
                .ok(response);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Integer id){
        log.info("id==={}",id);

        ApiResponse<ItemListResponse> response = marketService.getPostById(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Integer id, @AuthenticationPrincipal(expression = "userId") String currentUserId) {
        log.info("id=={}", id);
        log.info("user=={}", currentUserId);

        ApiResponse<?> response = marketService.deleteItemById(id, currentUserId);

        return  ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editPostById(@PathVariable Integer id, @RequestBody MarketEditRequest marketEditRequest, @AuthenticationPrincipal(expression = "userId") String currentUserId) {
        log.info("머임");
        log.info("id=={}", id);
        log.info("user=={}", currentUserId);
        log.info("MarketEditRequest=={}", marketEditRequest);
        ApiResponse<?> response = marketService.editItemById(id, marketEditRequest, currentUserId);

        return ResponseEntity.ok(response);
    }
}
