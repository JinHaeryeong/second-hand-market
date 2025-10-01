package com.example.project.chat.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Getter
public class ChatRoomResponse {
    private Long chatRoomId;
    private String partnerId;
    private String lastMessage;
    private LocalDateTime lastSentTime;
    private int unreadCount;
}
