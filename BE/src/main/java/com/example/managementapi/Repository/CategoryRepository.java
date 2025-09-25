package com.example.managementapi.Repository;

import com.example.managementapi.Entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, String> {
    boolean existsByCategoryName(String categoryName);
}
