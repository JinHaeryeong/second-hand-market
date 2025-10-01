package com.example.project.chat.Entity;

import com.example.project.post.entity.Items;
import com.example.project.user.entity.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity // 엔티티 이름 충돌 방지를 위해 이름 변경 권장
@Table(name = "chat_room") // DB 테이블 이름 명확히 지정
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 💡 1. 게시글 참조 (어떤 게시글에 대한 방인지)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Items item;

    // 💡 2. 구매 요청자 참조 (누가 채팅을 걸었는지)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private Member requester;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private RoomType roomType;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private Member recipient;


    @Builder
    public ChatRoom(Items item, Member requester, Member recipient, RoomType roomType, LocalDateTime createdAt) {
        this.item = item;
        this.recipient = recipient;
        this.requester = requester;
        this.roomType = roomType;
        this.createdAt = createdAt;
    }
}