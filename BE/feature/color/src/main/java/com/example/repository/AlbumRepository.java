package com.example.repository;

import com.example.common.dto.color.response.GetListAlbumRes;
import com.example.persistence.entity.Album;
import com.example.persistence.entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlbumRepository extends JpaRepository<Album,String> {
    List<Album> findBySupplier_SupplierId(String supplierId);
}
