package com.example.common.interfaces.color;

import com.example.common.dto.color.request.CreateAlbumReq;
import com.example.common.dto.color.request.CreateColorReq;
import com.example.common.dto.color.request.UpdateAlbumReq;
import com.example.common.dto.color.request.UpdateColorReq;
import com.example.common.dto.color.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ColorServiceInterface {

    List<GetColorWithSupplierRes> getColorWithSupplier(String supplierId);


    Page<GetColorRes> getColor(String keyword,
                               String supplierName,
                               Pageable pageable);

    GetColorDetailRes getColorDetail(String colorId);

    CreateColorRes createColor(CreateColorReq request);

    CreateAlbumRes createAlbum(CreateAlbumReq request);

    UpdateAlbumRes updateAlbum(String albumId, UpdateAlbumReq request);

    List<GetListAlbumRes> getListAlbum();

    UpdateColorRes updateColor(String colorId, UpdateColorReq request);

    ImportColorRes importColorFromJson(MultipartFile files);


    void deleteColor(String colorId);

    void deleteAlbum(String albumId);


}
