package com.example.project.post.domain;

import com.example.project.post.entity.Items;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemListResponse {
    private Long id;
    private String userId;
    private int categoryId;
    private String title;
    private String content;
    private int price;
    private String status;
    private LocalDateTime createdAt;
    private int views;

    // Category 테이블에서 가져올 필드
    private String categoryName;

    private String thumbnailUrl;

    // Items Entity의 모든 필드 + Category Name을 받는 생성자
    @Builder // Builder 패턴 사용 가능
    public ItemListResponse(
            Long id, String userId, int categoryId, String title,
            String content, int price, String status, LocalDateTime createdAt,
            int views, String categoryName) {

        this.id = id;
        this.userId = userId;
        this.categoryId = categoryId;
        this.title = title;
        this.content = content;
        this.price = price;
        this.status = status;
        this.createdAt = createdAt;
        this.views = views;
        this.categoryName = categoryName;
    }

    public static ItemListResponse of(Items entity, String categoryName) {
        return ItemListResponse.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .categoryId(entity.getCategoryId())
                .categoryName(categoryName) // 추출된 이름을 받음
                .price(entity.getPrice())
                .title(entity.getTitle())
                .content(entity.getContent())
                .createdAt(entity.getCreatedAt())
                .views(entity.getViews())
                .build();
    }
}
