package com.example.project.post.domain;

import com.example.project.post.entity.Notices;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticesListRequest {
    private Long id;
    private String userId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int views;
    // Entity -> DTO 로 변환하는 함수
    public static NoticesListRequest fromEntity(Notices notices){
        if(notices==null) return null;
        return NoticesListRequest.builder()
                .id(notices.getId())
                .userId(notices.getUserId())
                .title(notices.getTitle())
                .content(notices.getContent())
                .createdAt(notices.getCreatedAt())
                .updatedAt(notices.getUpdatedAt())
                .views(notices.getViews())
                .build();
    }
    //DTO -> Entity로 변환
    public Notices toEntity(){
        return Notices.builder()
                .id(this.id)
                .userId(this.userId)
                .title(this.title)
                .content(this.content)
                .createdAt(this.createdAt)
                .updatedAt(this.updatedAt)
                .views(this.views)
                .build();
    }
}
