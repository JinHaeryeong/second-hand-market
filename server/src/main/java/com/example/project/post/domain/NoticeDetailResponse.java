package com.example.project.post.domain;

import com.example.project.post.entity.Notices;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeDetailResponse {
    private Long id;
    private String userId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int views;

    private SimpleNotice prevNotice;
    private SimpleNotice nextNotice;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SimpleNotice {
        private Long id;
        private String title;
    }
}
