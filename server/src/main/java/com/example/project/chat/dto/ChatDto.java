package com.example.project.chat.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class ChatDto {

    private Long chatRoomId;
    private String sender;
    private String message;
    private LocalDateTime createdAt;
}