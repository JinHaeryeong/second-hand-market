package com.example.project.admin.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity(name = "AdminMember")
@Table(name="admin")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Setter
@Getter
@ToString
public class Member{
    @Id
    private int id;
    private String name;
    private String city;
    private int age;
    @Column(name="refreshtoken")
    private String refreshToken;

}
