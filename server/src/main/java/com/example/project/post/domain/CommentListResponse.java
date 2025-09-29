package com.example.project.post.domain;

import com.example.project.post.entity.Comments;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentListResponse {
    private int id;
    private String userId;
    private int itemId;
    private String status;
    private int price;
    private String txt;
    private String nickname;

    public CommentListResponse(Comments comments) {
        this.id = comments.getId();
        this.userId = comments.getUserId();
        this.itemId = comments.getItemId();
        this.status = comments.getStatus();
        this.price = comments.getPrice();
        this.txt = comments.getTxt();
        this.nickname = comments.getNickname();
    }
}
