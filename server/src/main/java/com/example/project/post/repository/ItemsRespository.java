package com.example.project.post.repository;

import com.example.project.post.domain.ItemListResponse;
import com.example.project.post.entity.Items;
import com.example.project.post.entity.Notices;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

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

    @Modifying
    @Transactional
    @Query(value = "UPDATE Items i SET i.status = '판매완료' WHERE i.id = :itemId AND i.userId = :userId")
    int updateStatusToSoldOut(
            @Param("itemId") Integer id,
            @Param("userId") String userId
    );

    @Query(value = "SELECT new com.example.project.post.domain.ItemListResponse(" +
            "i.id, i.userId, i.categoryId, i.title, i.content, i.price, i.status, i.createdAt, i.views, c.name, i.thumbnailUrl) " +
            "FROM Items i JOIN i.category c " +
            "WHERE LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(i.content) LIKE LOWER(CONCAT('%', :keyword, '%'))",
            countQuery = "SELECT COUNT(i) FROM Items i JOIN i.category c WHERE LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(i.content) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<ItemListResponse> findItemsByTitleOrContentKeyword( // 👈 새롭고 단순한 메서드명
                                                             @Param("keyword") String keyword,
                                                             Pageable pageable
    );

}
