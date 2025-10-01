package com.example.project.chat.controller;

import com.example.project.chat.dto.ChatDto;
import com.example.project.chat.dto.ChatRoomRequest;
import com.example.project.chat.dto.ChatRoomResponse;
import com.example.project.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat") // REST API 기본 경로 설정
public class ChatRoomController {

    private final ChatService chatService;

    @PostMapping("/room/{itemId}")
    public Long createChatRoom(@PathVariable Long itemId, Authentication authentication, @RequestBody ChatRoomRequest request) {

        String requesterUserId = authentication.getName();

        String recipientUserId = request.getRecipientId();

        // 3. 서비스 호출 시 두 참여자 ID 모두 전달
        return chatService.createOrGetChatRoom(itemId, requesterUserId, recipientUserId);
    }

    @GetMapping("/room/{chatRoomId}/messages")
    public List<ChatDto> loadChatHistory(@PathVariable Long chatRoomId) {
        log.info("들어오긴함?");
        return chatService.loadMessages(chatRoomId);
    }


    @GetMapping("/rooms")
    public List<ChatRoomResponse> loadChatRooms(Authentication authentication) {

        String currentUserId = authentication.getName();
        log.info("들오오나요 rooms");
        log.info(currentUserId);
        return chatService.getChatRoomsForUser(currentUserId);
    }
}