package com.example.repository;

import com.example.persistence.entity.Color;
import org.apache.poi.ss.formula.functions.T;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ColorRepository extends JpaRepository<Color,String>, JpaSpecificationExecutor<Color> {
    List<Color> findBySupplier_SupplierId(String supplierId);

    Page<Color> findBySupplier_SupplierId(String supplierId,
                                          Specification<Color> spec,
                                          Pageable pageable);

    Boolean existsByColorCode(String colorCode);

    Boolean existsByHexCode(String hexCode);
}
