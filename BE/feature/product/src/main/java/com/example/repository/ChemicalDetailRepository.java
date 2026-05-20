package com.example.repository;

import com.example.persistence.entity.ChemicalDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChemicalDetailRepository extends JpaRepository<ChemicalDetail,String> {
}
