package com.example.project.chat.Entity;

import com.example.project.user.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity(name = "chat_message")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 사용 시 필수
@AllArgsConstructor
@Builder // DTO -> Entity 변환 시 유용
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB에 맡겨 ID 자동 생성
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private Member sender;

    @Column(columnDefinition = "TEXT", nullable = false) // SQL의 TEXT 타입에 대응
    private String message;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // 메시지 상태(예: CHAT, JOIN, LEAVE)
    // private MessageType type;
}