package com.example.project.chat.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ChatRoomRequest {
    private String recipientId;

    // Getter, Setter 및 생성자 필요 (예: Lombok @Data 사용)
    public String getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(String recipientId) {
        this.recipientId = recipientId;
    }
}
