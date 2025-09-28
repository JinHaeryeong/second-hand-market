package com.example.project.user.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class UsersResponse {
    private String name;
    private String nickname;
    private String email;
    private String id;
    private LocalDateTime createdAt;
    private String city;
    private String role;
    private int age;
}
