package com.example.project.post.repository;

import com.example.project.post.entity.Notices;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Notices, Long> {
    @Query("select n  from Notices n where  n.title like  concat('%',:keyword,'%')")
    List<Notices> searchNotices(@Param("keyword") String keyword);

    //[2] Native Query  SQL  ==> nativeQuery=true 설정해야 함
    @Query(value = "select * from Notices where content like concat('%', :keyword,'%') limit :limit",
            nativeQuery = true)
    List<Notices> searchPostsLimit(@Param("keyword") String keyword, @Param("limit") int limit);

    @Query(value = "select n from Notices n where n.id < :currentId order by n.id desc limit 1")
    Optional<Notices> findPrevNotice(@Param("currentId") Long currentId);

    @Query(value = "select n from Notices  n where n.id > :currentId order by  n.id asc limit 1")
    Optional<Notices> findNextNotice(@Param("currentId") Long currentId);

    Page<Notices> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

    Page<Notices> findByUserIdContainingIgnoreCase(String keyword, Pageable pageable);

    Page<Notices> findByContentContainingIgnoreCase(String keyword, Pageable pageable);
}
