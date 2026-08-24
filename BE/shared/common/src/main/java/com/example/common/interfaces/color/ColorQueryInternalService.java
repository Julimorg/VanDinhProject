package com.example.common.interfaces.color;

import com.example.persistence.entity.Album;
import com.example.persistence.entity.Color;

import java.util.List;

public interface ColorQueryInternalService {

    void  validateColorExistById(String colorId);

    List<Album> findAlbumBySupplierId( String supplierId);

    List<Color> findColorBySupplierId( String supplierId);

    Color getColorById(String colorId);
}
