package com.example.project.user.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/file")
public class FileController {
    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/uploads")
    public ResponseEntity<Map<String, Object>> uploadFile(@RequestParam("upload") MultipartFile file) {

        Map<String, Object> response = new HashMap<>();

        if (file.isEmpty()) {
            response.put("uploaded", 0);
            response.put("error", Map.of("message", "파일이 존재하지 않습니다."));
            return ResponseEntity.ok(response);
        }

        try {
            // 1. 파일명 생성 (중복 방지를 위해 UUID 사용)
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String fileName = UUID.randomUUID().toString() + fileExtension;

            // 2. 저장 경로 설정 및 파일 저장
            File dest = new File(uploadDir, fileName);
            file.transferTo(dest);

            // 3. CKEditor 응답 형식에 맞춰 URL 생성
            // WebConfig에서 /api/file/** 로 설정했으므로, 이 경로를 사용합니다.
            String fileUrl = "/api/file/" + fileName;

            // 4. 성공 응답 (CKEditor가 요구하는 JSON 형식)
            response.put("uploaded", 1);
            response.put("fileName", fileName);
            response.put("url", fileUrl);

            return ResponseEntity.ok(response);

        } catch ( IOException e) {
            e.printStackTrace();
            response.put("uploaded", 0);
            response.put("error", Map.of("message", "파일 저장 중 오류가 발생했습니다: " + e.getMessage()));
            return ResponseEntity.internalServerError().body(response);
        }
    }


}
