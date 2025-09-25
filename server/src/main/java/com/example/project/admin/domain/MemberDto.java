package com.example.project.admin.domain;

import com.example.project.admin.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MemberDto {
    private int id;
    private String name;
    private String city;
    private int age;
    public static MemberDto fromEntity(Member member) {
        return new MemberDto(
                member.getId(),
                member.getName(),
                member.getCity(),
                member.getAge()
        );
    }
}
