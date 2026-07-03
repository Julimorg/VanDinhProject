package com.example.common.interfaces.category;

import com.example.common.dto.category.request.CreateCategoryReq;
import com.example.common.dto.category.request.UpdateCategoryReq;
import com.example.common.dto.category.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CategoryServiceInterface {


    List<GetCategoriesSelectionRes> getCategoriesSelection();

    Page<GetCategoriesRes> getCategories(Pageable pageable, String keyword);

    GetDetailCategoryRes getCategory(String id);

    CreateCategoryRes createCategory(CreateCategoryReq request);

    UpdateCategoryRes updateCategory(String id, UpdateCategoryReq request);

    void deleteCategory(String id);

}
