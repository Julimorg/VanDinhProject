export type IUpdateCategoryRequest = {
    categoryName: string,
    categoryDescription: string,
    categoryImage?: File | string,
}


export type IUpdateCategoryResponse = {
    categoryName: string,
    categoryDescription: string,
    categoryImage: string,
    updateAt: string,
}