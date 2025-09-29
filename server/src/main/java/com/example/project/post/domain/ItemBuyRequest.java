package com.example.project.post.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor

public class ItemBuyRequest {
    private String nickname;
    private int price;
    private String txt;
    private int itemId;
}
