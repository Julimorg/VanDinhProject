package com.example.managementapi.Repository;

import com.example.managementapi.Entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

//? JpaSpecificationExecutor -> support Query với SpecificationExecutor
@Repository
public interface ColorRepository extends JpaRepository<Color, String>, JpaSpecificationExecutor<Color> {
    List<Color> findBySupplier_SupplierId(String supplierId);

}
