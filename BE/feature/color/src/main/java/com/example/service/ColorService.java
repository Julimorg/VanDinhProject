package com.example.service;

import com.example.common.dto.color.request.CreateAlbumReq;
import com.example.common.dto.color.request.CreateColorReq;
import com.example.common.dto.color.request.UpdateAlbumReq;
import com.example.common.dto.color.request.UpdateColorReq;
import com.example.common.dto.color.response.*;
import com.example.common.dto.order.response.GetAllOrdersRes;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.color.ColorServiceInterface;
import com.example.common.interfaces.supplier.SupplierQueryInternalService;
import com.example.common.service.CloudinaryService;
import com.example.common.service.FileUploadService;
import com.example.config.ColorSpecification;
import com.example.mapper.AlbumMapper;
import com.example.mapper.ColorMapper;
import com.example.persistence.entity.Album;
import com.example.persistence.entity.Color;
import com.example.persistence.entity.Supplier;
import com.example.repository.AlbumRepository;
import com.example.repository.ColorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.naming.EjbRef;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ColorService implements ColorServiceInterface {

    private final ColorRepository colorRepository;

    private final AlbumRepository albumRepository;

    private final ColorMapper  colorMapper;

    private final AlbumMapper albumMapper;

    private final CloudinaryService  cloudinaryService;

    private final SupplierQueryInternalService supplierInternalService;

    private final FileUploadService fileUploadService;

    @Override
    public List<GetColorWithSupplierRes> getColorWithSupplier(String supplierId){

        supplierInternalService.validateSupplierExists(supplierId);

        return colorRepository
                .findBySupplier_SupplierId(supplierId)
                .stream()
                .map(colorMapper::toGetColorWithSupplier)
                .toList();
    }

    @Override
    public Page<GetColorRes> getColor(String keyword,
                                      String supplierName,
                                      Pageable pageable){
        Specification<Color> spec = ColorSpecification
                .from(ColorSpecification
                        .ColorFilter
                        .keywordAndSupplier(keyword, supplierName));

        return colorRepository
                .findAll(spec, pageable)
                .map(color -> colorMapper.toGetColorRes(color));

    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER','ROLE_STAFF')")
    public GetColorDetailRes getColorDetail(String colorId){

        Color color = colorRepository.findById(colorId)
                .orElseThrow(() -> new RuntimeException("Color not found!"));

        return colorMapper.toGetColorDetailRes(color);
    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public CreateColorRes createColor(CreateColorReq request){

        Supplier supplier = supplierInternalService
                .getSupplierById(request
                        .getSupplierId());

        Color color = colorMapper.toCreateColorReq(request);

        color.setSupplier(supplier);

        if(StringUtils.hasText(request.getAlbumId())){
            Album album = albumRepository.
                    findById(request.getAlbumId())
                    .orElseThrow(() -> new RuntimeException(String.valueOf(ErrorCode.ALBUM_NOT_FOUND)));

            if (!album.getSupplier().getSupplierId().equals(request.getSupplierId())) {
                throw new RuntimeException(String.valueOf(ErrorCode.ALBUM_SUPPLIER_MISMATCH));
            }

            color.setAlbum(album);
        }

        color.setColorImg(fileUploadService
                .uploadImageIfPresent(request.getColorImg(), request.getColorName()));

        color = colorRepository.save(color);

        return colorMapper.toCreateColorRes(color);
    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public CreateAlbumRes createAlbum(CreateAlbumReq request) {

        Supplier supplier = supplierInternalService.getSupplierById(request.getSupplierId());

        Album album = albumMapper.toAlbum(request);

        album.setSupplier(supplier);

        Album saved = albumRepository.save(album);

        return albumMapper.toCreateAlbum(albumRepository.save(saved));
    }

    @Override
    public UpdateAlbumRes updateAlbum(String albumId, UpdateAlbumReq request) {

        Album album = albumRepository.findById(albumId)
                .orElseThrow( () -> new RuntimeException(String.valueOf(ErrorCode.ALBUM_NOT_FOUND)));

        albumMapper.toUpdateAlbum(album, request);

        Album saved = albumRepository.save(album);

        return albumMapper.toUpdateAlbumRes(saved);
    }

    @Override
    public List<GetListAlbumRes> getListAlbum() {
        return albumRepository
                .findAll()
                .stream()
                .map(c -> albumMapper.toGetListAlbumRes(c))
                .toList();
    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public UpdateColorRes updateColor(String colorId, UpdateColorReq request) {

        Color color = colorRepository
                .findById(colorId)
                .orElseThrow(() -> new RuntimeException("Color not Found!"));

        color.setColorImg(fileUploadService.uploadImageIfPresent(request.getColorImg(), request.getColorName()));

        colorMapper.toUpdateColor(color, request);

        color = colorRepository.save(color);

        return colorMapper.toUpdateColorRes(color);

    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public void deleteColor(String colorId){
        if(!colorRepository.existsById(colorId)){
            throw new AppException(ErrorCode.COLOR_NOT_FOUND);
        }
        colorRepository.deleteById(colorId);
    }

    @Override
    public void deleteAlbum(String albumId) {
        if (!albumRepository.existsById(albumId)){
            throw new AppException(ErrorCode.ALBUM_NOT_FOUND);
        }

        albumRepository.deleteById(albumId);
    }

}
