package com.example.project.chat.repository;

import com.example.project.chat.Entity.ChatMessage;
import com.example.project.chat.Entity.ChatRoom;
import com.example.project.post.entity.Items;
import com.example.project.user.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByItemAndRequesterAndRecipient(Items item, Member requester, Member recipient);

    Optional<ChatRoom> findByItemIdAndRequesterAndRecipient(Long itemId, Member requester, Member recipient);

    List<ChatRoom> findByRequesterOrRecipient(Member requester, Member recipient);
}
