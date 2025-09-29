package com.example.project.post.repository;

import com.example.project.post.entity.Comments;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentsRepository extends JpaRepository<Comments, Integer> {
    List<Comments> findByItemId(Integer id);
}
