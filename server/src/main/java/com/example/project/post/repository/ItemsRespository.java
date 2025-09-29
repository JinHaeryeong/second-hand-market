package com.example.project.post.repository;

import com.example.project.post.domain.ItemListResponse;
import com.example.project.post.entity.Items;
import com.example.project.post.entity.Notices;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ItemsRespository extends JpaRepository<Items, Integer> {
    @Query(value = "SELECT new com.example.project.post.domain.ItemListResponse(" +
            "i.id, i.userId, i.categoryId, i.title, i.content, i.price, i.status, i.createdAt, i.views, c.name, i.thumbnailUrl) " +
            "FROM Items i JOIN i.category c",
            countQuery = "SELECT COUNT(i) FROM Items i JOIN i.category c") // 총 요소 수를 세는 쿼리
    Page<ItemListResponse> findAllWithCategoryName(Pageable pageable);
    Page<ItemListResponse> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

    Page<ItemListResponse> findByUserIdContainingIgnoreCase(String keyword, Pageable pageable);

    Page<ItemListResponse> findByContentContainingIgnoreCase(String keyword, Pageable pageable);
}
