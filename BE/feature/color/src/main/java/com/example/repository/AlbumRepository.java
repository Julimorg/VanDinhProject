package com.example.repository;

import com.example.common.dto.color.response.GetListAlbumRes;
import com.example.persistence.entity.Album;
import com.example.persistence.entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface AlbumRepository extends JpaRepository<Album,String> {

}
