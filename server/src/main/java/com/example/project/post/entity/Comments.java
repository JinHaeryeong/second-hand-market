package com.example.project.post.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Table(name = "comments")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Setter
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@ToString(exclude = "category")
public class Comments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "item_id")
    private int itemId;

    @Column
    private String nickname;

    @Column
    private int price;

    @ColumnDefault("'미수락'")
    @Builder.Default
    private String status = "미수락";

    @Column
    private String txt;

}
