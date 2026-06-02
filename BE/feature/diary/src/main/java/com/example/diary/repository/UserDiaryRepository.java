package com.example.diary.repository;

import com.example.persistence.entity.UserDiary;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDiaryRepository extends JpaRepository<UserDiary, String>, JpaSpecificationExecutor<UserDiary> {

    Page<UserDiary> findByUserId(String userId, Pageable pageable);
}
