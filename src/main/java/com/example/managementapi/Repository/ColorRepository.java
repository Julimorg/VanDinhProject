package com.example.managementapi.Repository;

import com.example.managementapi.Entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColorRepository extends JpaRepository<Color, String> {
}
