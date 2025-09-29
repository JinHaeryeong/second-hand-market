package com.example.project.post.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "category")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter // Setter 제거
@AllArgsConstructor(access = AccessLevel.PRIVATE) // 접근 제한
@ToString
public class Category {
    @Id
    @Column(name = "category_id")
    private int id;

    @Column(name = "category_name")
    private String name;
}
