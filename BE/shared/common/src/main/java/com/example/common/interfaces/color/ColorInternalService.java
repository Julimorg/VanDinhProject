package com.example.common.interfaces.color;

import com.example.persistence.entity.Color;

public interface ColorInternalService {

    void  validateColorExistById(String colorId);

    Color getColorById(String colorId);
}
