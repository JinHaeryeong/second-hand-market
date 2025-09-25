package com.example.project.post.repository;

import com.example.project.post.entity.Notices;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notices, Long> {

}
