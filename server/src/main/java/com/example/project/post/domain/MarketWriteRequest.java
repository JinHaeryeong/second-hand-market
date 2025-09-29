package com.example.project.post.domain;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MarketWriteRequest {
    private String userId;
    private String title;
    private String content;
    private int category;
    private int price;
}
