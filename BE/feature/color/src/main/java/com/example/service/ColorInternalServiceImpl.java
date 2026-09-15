package com.example.service;

import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.color.ColorQueryInternalService;
import com.example.mapper.ColorMapper;
import com.example.persistence.entity.Album;
import com.example.persistence.entity.Color;
import com.example.persistence.entity.Supplier;
import com.example.repository.AlbumRepository;
import com.example.repository.ColorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ColorInternalServiceImpl implements ColorQueryInternalService {

    private final ColorRepository colorRepository;

    private final AlbumRepository albumRepository;

    private final ColorMapper colorMapper;


    @Override
    public void validateColorExistById(String colorId) {
        if (!colorRepository.existsById(colorId)) {
            throw new AppException(ErrorCode.COLOR_NOT_EXISTED);
        }
    }

    @Override
    public List<Album> findAlbumBySupplierId(String supplierId) {
        return albumRepository.findBySupplier_SupplierId(supplierId);
    }

    @Override
    public List<Color> findColorBySupplierId(String supplierId) {
        return colorRepository.findBySupplier_SupplierId(supplierId);
    }

    @Override
    public Color getColorById(String colorId) {

        validateColorExistById(colorId);

        Color color = colorRepository.findById(colorId)
                .orElseThrow(() -> new RuntimeException(ErrorCode.COLOR_NOT_FOUND + colorId));
        return colorMapper.toGetColorByIdWithInterface(color);

    }
}
