package com.example.project.chat.repository;

import com.example.project.chat.Entity.ChatMessage;
import com.example.project.chat.Entity.ChatRoom;
import com.example.project.user.entity.Member;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatRoomId(Long chatRoomId, Sort sort);


    Optional<ChatMessage> findTopByChatRoomOrderByCreatedAtDesc(ChatRoom chatRoom);

//    int countByChatRoomAndSenderNotAndReadStatus(ChatRoom chatRoom, Member sender, boolean read);
}
