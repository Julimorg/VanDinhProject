package com.example.mapper;

import com.example.common.dto.color.request.CreateAlbumReq;
import com.example.common.dto.color.request.UpdateAlbumReq;
import com.example.common.dto.color.response.CreateAlbumRes;
import com.example.common.dto.color.response.GetListAlbumRes;
import com.example.common.dto.color.response.UpdateAlbumRes;
import com.example.persistence.entity.Album;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AlbumMapper {

    //* =========================== GET MAPPER ===========================

    GetListAlbumRes toGetListAlbumRes(Album album);


    //* =========================== CREATE MAPPER ===========================

    @Mapping(target = "supplier.supplierId", source = "supplierId")
    Album toAlbum(CreateAlbumReq request);

    CreateAlbumRes toCreateAlbum(Album album);


    //* =========================== UPDATE MAPPER ===========================

    void toUpdateAlbum(@MappingTarget Album album, UpdateAlbumReq request);

    UpdateAlbumRes toUpdateAlbumRes(Album album);

}
