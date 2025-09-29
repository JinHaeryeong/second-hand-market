package com.example.project.post.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "items")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Setter
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@ToString(exclude = "category")
public class Items {
    @Id
    @Column(name = "item_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "category_id")
    private int categoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", insertable = false, updatable = false)
    private Category category;

    @Column
    private String title;

    @Column
    private String content;

    @Column
    private int price;

    @ColumnDefault("'판매중'")
    @Builder.Default
    private String status = "판매중";

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ColumnDefault("0")
    @Builder.Default
    private int views = 0;

    @Column(nullable = true, length = 255)
    private String thumbnailUrl;

    public void updateStatus(String newStatus) {
        this.status = newStatus;
    }

}
