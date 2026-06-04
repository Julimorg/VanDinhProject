package com.example.diary.repository;

import com.example.persistence.entity.UserDiaryItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDiaryItemRepository
    extends JpaRepository<UserDiaryItem, String>
{
    List<UserDiaryItem> findByDiaryId(String diaryId);

    List<UserDiaryItem> findByDiaryIdOrderByItemDateAsc(String diaryId);

    void deleteByDiaryId(String diaryId);
}
