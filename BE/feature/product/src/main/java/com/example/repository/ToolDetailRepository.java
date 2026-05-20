package com.example.repository;

import com.example.persistence.entity.ToolDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ToolDetailRepository extends JpaRepository<ToolDetail, String> {
}
