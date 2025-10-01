package com.example.project.chat.controller;

import com.example.project.chat.dto.ChatDto;
import com.example.project.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
@Slf4j
public class StompController {

    private final ChatService chatService;

    @MessageMapping("/chat/{chatRoomId}")
    @SendTo("/sub/chat/{chatRoomId}")
    // 메서드의 반환값을 해당 경로로 전달해준다는 말
    public ChatDto message(
            @DestinationVariable Long chatRoomId,
            @Payload ChatDto request) {
        log.info("chatRoomId: {}, message: {}", chatRoomId, request.getMessage());
        request.setChatRoomId(chatRoomId);
        request.setCreatedAt(LocalDateTime.now());

        chatService.save(request);
        log.info("chatRoomId: {}, sender: {}, message: {}", chatRoomId, request.getSender(), request.getMessage());
        return request;
    }
}
