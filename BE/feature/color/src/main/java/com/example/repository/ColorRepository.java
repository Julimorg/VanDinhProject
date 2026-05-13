package com.example.repository;

import com.example.persistence.entity.Color;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ColorRepository extends JpaRepository<Color,String>, JpaSpecificationExecutor<Color> {
    List<Color> findBySupplier_SupplierId(String supplierId);
}
