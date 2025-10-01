package com.example.project.chat.service;

import com.example.project.chat.Entity.ChatMessage;
import com.example.project.chat.Entity.ChatRoom;
import com.example.project.chat.Entity.RoomType;
import com.example.project.chat.dto.ChatDto;
import com.example.project.chat.dto.ChatRoomResponse;
import com.example.project.chat.repository.ChatRepository;
import com.example.project.chat.repository.ChatRoomRepository;
import com.example.project.post.entity.Items;
import com.example.project.post.repository.ItemsRespository;
import com.example.project.user.entity.Member;
import com.example.project.user.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final MemberRepository memberRepository;
    private final ItemsRespository itemsRepository;


    private ChatRoomResponse convertToResponseDto(ChatRoom chatRoom, String currentUserId) {

        Member partner = chatRoom.getRequester().getUserId().equals(currentUserId)
                ? chatRoom.getRecipient()
                : chatRoom.getRequester();

        ChatMessage lastMessage = chatRepository.findTopByChatRoomOrderByCreatedAtDesc(chatRoom)
                .orElse(null);

        String messageContent = lastMessage != null ? lastMessage.getMessage() : "대화 시작";
        LocalDateTime sentTime = lastMessage != null ? lastMessage.getCreatedAt() : chatRoom.getCreatedAt();

        int unreadCount = 0;

        return ChatRoomResponse.builder()
                .chatRoomId(chatRoom.getId())
                .partnerId(partner.getUserId())
                .lastMessage(messageContent)
                .lastSentTime(sentTime)
                .unreadCount(unreadCount)
                .build();
    }

    @Transactional(readOnly = true)
    public List<ChatRoomResponse> getChatRoomsForUser(String userId) {

        Member user = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        List<ChatRoom> rooms = chatRoomRepository.findByRequesterOrRecipient(user, user);

        return rooms.stream()
                .map(room -> this.convertToResponseDto(room, userId))
                .toList();
    }


    @Transactional
    public Long createOrGetChatRoom(Long itemId, String requesterUserId, String recipientUserId) {

        Items item = itemsRepository.findById(itemId.intValue())
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));
        Member requester = memberRepository.findByUserId(requesterUserId)
                .orElseThrow(() -> new RuntimeException("Requester not found: " + requesterUserId));
        Member recipient = memberRepository.findByUserId(recipientUserId)
                .orElseThrow(() -> new RuntimeException("Recipient not found: " + recipientUserId));

        String sellerUserId = item.getUserId();

        if (requesterUserId.equals(recipientUserId)) {
            throw new RuntimeException("Cannot chat with self.");
        }

        Optional<ChatRoom> existingRoom = chatRoomRepository.findByItemAndRequesterAndRecipient(item, requester, recipient);

        if (existingRoom.isEmpty()) {
            existingRoom = chatRoomRepository.findByItemAndRequesterAndRecipient(item, recipient, requester);
        }

        return existingRoom.map(ChatRoom::getId)
                .orElseGet(() -> {
                    ChatRoom newRoom = ChatRoom.builder()
                            .item(item)
                            .requester(requester)
                            .recipient(recipient)
                            .roomType(RoomType.ONE_TO_ONE)
                            .createdAt(LocalDateTime.now())
                            .build();
                    chatRoomRepository.save(newRoom);
                    return newRoom.getId();
                });
    }

    @Transactional
    public void save(ChatDto chatDto) {

        ChatRoom chatRoom = chatRoomRepository.findById(chatDto.getChatRoomId())
                .orElseThrow(() -> new RuntimeException("ChatRoom not found: " + chatDto.getChatRoomId()));

        String userId = chatDto.getSender();
        Member sender = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Sender not found with ID: " + userId));

        ChatMessage chatMessage = ChatMessage.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .message(chatDto.getMessage())
                .createdAt(chatDto.getCreatedAt())
                .build();

        chatRepository.save(chatMessage);
    }


    @Transactional(readOnly = true)
    public List<ChatDto> loadMessages(Long chatRoomId) {
        List<ChatMessage> messages = chatRepository.findByChatRoomId(
                chatRoomId,
                Sort.by(Sort.Direction.ASC, "createdAt")
        );

        return messages.stream()
                .map(this::convertToDto)
                .toList();
    }

    private ChatDto convertToDto(ChatMessage message) {
        String senderId = message.getSender().getUserId();

        ChatDto dto = new ChatDto();
        dto.setChatRoomId(message.getChatRoom().getId());
        dto.setSender(senderId);
        dto.setMessage(message.getMessage());
        dto.setCreatedAt(message.getCreatedAt());
        return dto;
    }
}