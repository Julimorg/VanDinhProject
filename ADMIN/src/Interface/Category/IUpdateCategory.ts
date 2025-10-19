export type IUpdateCategoryRequest = {
    categoryName: string,
    categoryDescription: string,
    categoryImage: File,

}

export type IUpdateCategoryResponse = {
    categoryName: string,
    categoryDescription: string,
    categoryImage: string,
    updateAt: string,
}