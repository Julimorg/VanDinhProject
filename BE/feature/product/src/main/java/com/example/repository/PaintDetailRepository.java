package com.example.repository;

import com.example.persistence.entity.PaintDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaintDetailRepository extends JpaRepository<PaintDetail, String> {
}
